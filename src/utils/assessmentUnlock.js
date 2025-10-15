// src/utils/assessmentUnlock.js

/**
 * Main function to check if assessment can be started/retaken
 * Handles both first attempts and retakes with resource completion logic
 */
export function checkAssessmentAccess(assessment, learningProgress, weakAreas, userScores = null) {
  // Surveys are never locked
  if (assessment.mode === "survey") {
    return { canAccess: true, reason: "survey" };
  }

  // If no attempts yet, check first attempt access
  if (!assessment.attempts || assessment.attempts === 0) {
    return checkFirstAttemptAccess(assessment, userScores, learningProgress, weakAreas);
  }

  // If already taken once, use 2nd attempt unlock logic
  if (assessment.attempts === 1) {
    return check2ndAttemptUnlock(assessment, learningProgress, weakAreas);
  }

  // If already taken twice, block
  if (assessment.attempts >= 2) {
    return { 
      canAccess: false, 
      reason: "max_attempts",
      message: "You have reached the maximum of 2 attempts for this assessment."
    };
  }

  // Default: allow access
  return { canAccess: true, reason: "first_attempt" };
}

/**
 * Checks if student can take first attempt
 * Locks if they already meet threshold until resources are completed
 */
function checkFirstAttemptAccess(assessment, userScores, learningProgress, weakAreas) {
  // If assessment was already taken (has attempts), don't apply first attempt logic
  if (assessment.attempts && assessment.attempts > 0) {
    return { canAccess: true, reason: "already_attempted" };
  }

  const assessmentThresholds = {
    'assessments_operating_systems': { key: 'os_perc', threshold: 60 },
    'assessments_algorithms': { key: 'algo_perc', threshold: 60 },
    'assessments_programming': { key: 'prog_perc', threshold: 60 },
    'assessments_software_engineering': { key: 'se_perc', threshold: 60 },
    'assessments_computer_networks': { key: 'cn_perc', threshold: 60 },
    'assessments_communication': { key: 'comm_perc', threshold: 60 },
    'assessments_mathematics': { key: 'math_perc', threshold: 60 },
    'assessments_electronics': { key: 'es_perc', threshold: 60 },
    'assessments_computer_architecture': { key: 'ca_perc', threshold: 60 },
    'technicalAssessments_coding_skills': { key: 'coding_skills', threshold: 3 },
    'technicalAssessments_logical_quotient': { key: 'logical_quotient', threshold: 3 },
    'technicalAssessments_memory_test': { key: 'memory_test', threshold: 5 },
  };

  const thresholdInfo = assessmentThresholds[assessment.id];
  
  if (thresholdInfo && userScores) {
    const currentScore = userScores[thresholdInfo.key] || 0;
    
    // If student meets or exceeds threshold
    if (currentScore >= thresholdInfo.threshold) {
      // Check resource completion
      const relatedWeakArea = weakAreas.find(area => {
        const assessmentTopic = assessment.id
          .replace('assessments_', '')
          .replace('technicalAssessments_', '')
          .replace(/_/g, ' ')
          .toLowerCase();
        
        return area.topic.toLowerCase().includes(assessmentTopic) || 
               assessmentTopic.includes(area.topic.toLowerCase());
      });

      if (relatedWeakArea) {
        const topicKey = relatedWeakArea.topic.replace(/\s+/g, '_').toLowerCase();
        const progress = learningProgress[topicKey];
        const totalResourcesNeeded = 3;
        const completedCount = progress?.resources?.filter(r => r.status === "completed").length || 0;
        const completionPercentage = Math.round((completedCount / totalResourcesNeeded) * 100);
        
        // If resources completed, allow
        if (completedCount >= totalResourcesNeeded) {
          return { 
            canAccess: true, 
            reason: "resources_completed",
            message: "Resources completed - Ready to take assessment!"
          };
        }

        // Lock until resources completed
        return {
          canAccess: false,
          reason: "threshold_met_incomplete_resources",
          currentScore: currentScore,
          threshold: thresholdInfo.threshold,
          completionPercentage: completionPercentage,
          completedResources: completedCount,
          requiredCompletion: totalResourcesNeeded,
          message: `You've already scored ${currentScore}% (threshold: ${thresholdInfo.threshold}%). Complete ${totalResourcesNeeded - completedCount} more learning resource(s) to unlock this assessment.`
        };
      }
    }
  }

  // Default: Allow first attempt
  return { canAccess: true, reason: "first_attempt" };
}

/**
 * Checks if a student can unlock their 2nd attempt for an assessment
 * Uses hybrid logic: Resources completion OR 7-day wait
 * @deprecated Use checkAssessmentAccess instead for new code
 */
export function check2ndAttemptUnlock(assessment, learningProgress, weakAreas) {
  // If it's a survey, always allow
  if (assessment.mode === "survey") {
    return { canAccess: true, reason: "survey" };
  }

  // If no attempts yet, allow first attempt
  if (!assessment.attempts || assessment.attempts === 0) {
    return { canAccess: true, reason: "first_attempt" };
  }

  // If already taken twice, block completely
  if (assessment.attempts >= 2) {
    return { 
      canAccess: false, 
      reason: "max_attempts",
      message: "You have reached the maximum of 2 attempts for this assessment."
    };
  }

  // If exactly 1 attempt, check unlock conditions
  if (assessment.attempts === 1) {
    const result = assessment.result;
    
    if (!result || !result.submittedAt) {
      return { canAccess: true, reason: "first_attempt" };
    }

    // Get the submission date
    const submittedDate = result.submittedAt?.toDate 
      ? result.submittedAt.toDate() 
      : new Date(result.submittedAt);
    
    const now = new Date();
    const daysSinceSubmission = Math.floor((now - submittedDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 7 - daysSinceSubmission);

    // Check if this assessment relates to a weak area
    const relatedWeakArea = weakAreas.find(area => {
      // Match assessment ID pattern to weak area
      const assessmentTopic = assessment.id
        .replace('assessments_', '')
        .replace('technicalAssessments_', '')
        .replace(/_/g, ' ')
        .toLowerCase();
      
      return area.topic.toLowerCase().includes(assessmentTopic) || 
             assessmentTopic.includes(area.topic.toLowerCase());
    });

    // If there's a related weak area, check resource completion
    if (relatedWeakArea) {
      const topicKey = relatedWeakArea.topic.replace(/\s+/g, '_').toLowerCase();
      const progress = learningProgress[topicKey];
      
      // Count completed resources
      const completedCount = progress?.resources?.filter(r => r.status === "completed").length || 0;
      
      // Determine required resources: Use 100% of recommended level resources
      // If user completed 2 resources, that should be the requirement (since that's all that's available at their level)
      const requiredResources = completedCount >= 2 ? 2 : 3; // Flexible: 2 or 3 resources
      const completionPercentage = Math.round((completedCount / requiredResources) * 100);
      
      // Path 1: Resource completion (unlock if completed at least 2 resources)
      if (completedCount >= 2) {
        return { 
          canAccess: true, 
          reason: "resources_completed",
          completionPercentage: 100,
          completedResources: completedCount,
          requiredCompletion: completedCount, // Set to actual completed count
          daysRemaining: daysRemaining
        };
      }

      // Path 2: Time-based unlock (7 days)
      if (daysSinceSubmission >= 7) {
        return { 
          canAccess: true, 
          reason: "time_elapsed",
          completionPercentage: completionPercentage,
          completedResources: completedCount,
          requiredCompletion: requiredResources,
          daysRemaining: 0
        };
      }

      // Still locked - show progress on both paths
      return {
        canAccess: false,
        reason: "locked",
        completionPercentage: completionPercentage,
        completedResources: completedCount,
        requiredCompletion: requiredResources,
        daysRemaining: daysRemaining,
        daysSinceSubmission: daysSinceSubmission,
        message: `Complete ${requiredResources - completedCount} more resource(s) or wait ${daysRemaining} more day${daysRemaining !== 1 ? 's' : ''} to unlock.`
      };
    }

    // No weak area found - use time-based only
    if (daysSinceSubmission >= 7) {
      return { 
        canAccess: true, 
        reason: "time_elapsed",
        daysRemaining: 0
      };
    }

    return {
      canAccess: false,
      reason: "locked",
      daysRemaining: daysRemaining,
      daysSinceSubmission: daysSinceSubmission,
      completionPercentage: 0,
      requiredCompletion: 0,
      message: `Wait ${daysRemaining} more day${daysRemaining !== 1 ? 's' : ''} to unlock your 2nd attempt.`
    };
  }

  // Default fallback
  return { canAccess: false, reason: "unknown" };
}

/**
 * Gets a user-friendly unlock message based on status
 */
export function getUnlockMessage(unlockStatus) {
  if (unlockStatus.reason === "max_attempts") {
    return "You have completed both attempts for this assessment. No further attempts are available.";
  }

  if (unlockStatus.reason === "locked") {
    const hasResources = unlockStatus.requiredCompletion > 0;
    const resourcesRemaining = unlockStatus.requiredCompletion - (unlockStatus.completedResources || 0);
    
    if (hasResources && unlockStatus.daysRemaining > 0) {
      return `To unlock your 2nd attempt, you can either:\n\n` +
             `📚 Complete ${resourcesRemaining} more learning resource(s) (${unlockStatus.completedResources || 0}/${unlockStatus.requiredCompletion} done)\n` +
             `⏰ Wait ${unlockStatus.daysRemaining} more day${unlockStatus.daysRemaining !== 1 ? 's' : ''}\n\n` +
             `Visit the Learning Path to track your progress!`;
    }
    
    if (hasResources) {
      return `Complete ${resourcesRemaining} more resource(s) in the Learning Path to unlock your 2nd attempt immediately!`;
    }
    
    return `Your 2nd attempt will unlock in ${unlockStatus.daysRemaining} day${unlockStatus.daysRemaining !== 1 ? 's' : ''}.`;
  }

  return "This assessment is currently locked.";
}