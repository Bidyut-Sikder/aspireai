import React from 'react'

interface QuizResultProps {
  result: any;
  onStartNew: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ result, onStartNew }) => {

    console.log(result)
    return (
    <div>QuizResult</div>
  )
}

export default QuizResult