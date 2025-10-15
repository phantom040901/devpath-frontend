// src/components/admin/PerformanceChart.jsx
import { useEffect, useRef } from "react";
import Chart from 'chart.js/auto';

export default function PerformanceChart({ data, type = "line", title }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Chart configuration based on type
    const config = {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: data.datasets?.length > 1,
            position: 'bottom',
            labels: {
              color: '#d1d5db',
              padding: 15,
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: '#fff',
            bodyColor: '#d1d5db',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y + (type === 'bar' || type === 'line' ? '%' : '');
                }
                return label;
              }
            }
          }
        },
        scales: type !== 'doughnut' && type !== 'pie' ? {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#9ca3af',
              callback: function(value) {
                return value + '%';
              }
            },
            grid: {
              color: 'rgba(75, 85, 99, 0.2)'
            }
          },
          x: {
            ticks: {
              color: '#d1d5db'
            },
            grid: {
              display: false
            }
          }
        } : undefined
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type]);

  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      )}
      <canvas ref={chartRef}></canvas>
    </div>
  );
}