import { motion } from "motion/react";
import CaretUp from "../../icons/CaretUp";

export default function FAQ({ question, activeQuestion, handleQuestionClick }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.li variants={itemVariants} className="shrink-0 grow-0">
      <button
        className="flex w-full cursor-pointer items-start max-sm:items-center"
        onClick={() => handleQuestionClick(question.id)}
      >
        <div className="border-primary-50 mr-6 rounded-xl border-2 p-3.5 flex-shrink-0 max-sm:mr-3 max-sm:p-2.5 max-sm:rounded-lg">
          <question.Icon
            width={2}
            className="stroke-primary-50 max-sm:w-5 max-sm:h-5"
            alt={question.alt}
          />
        </div>

        <p className="text-primary-50 mr-auto pr-4 text-left text-xl/loose font-medium tracking-tight max-lg:text-lg/8 max-lg:font-semibold max-sm:text-sm max-sm:leading-6 max-sm:font-medium max-sm:pr-2">
          {question.question}
        </p>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center max-sm:h-10 max-sm:w-10">
          <CaretUp
            className="stroke-primary-50 max-sm:w-5 max-sm:h-5"
            activeQuestion={activeQuestion === question.id}
            width={2.5}
            alt="Caret Up Icon"
          />
        </div>
      </button>
      <motion.p
        className="text-primary-100 pt-0 pr-14 pl-20 text-lg/8 font-light max-lg:text-base/loose max-lg:pl-16 max-md:pr-8 max-md:pl-14 max-sm:pr-0 max-sm:pl-11 max-sm:text-sm max-sm:leading-relaxed"
        initial={{ opacity: 0, maxHeight: 0, visibility: "hidden" }}
        animate={
          activeQuestion === question.id
            ? {
                opacity: 1,
                maxHeight: "400px",
                visibility: "visible",
                paddingTop: "1rem",
              }
            : {}
        }
        transition={{ duration: 0.3, ease: "easeIn" }}
        layout
      >
        {question.answer}
      </motion.p>
    </motion.li>
  );
}
