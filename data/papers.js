const papers = {};

function createMockPapers(courseId){

  const questions = mcqs[courseId] || [];

  if(!questions.length) return [];

  const result = [];

  for(let paperNumber = 1; paperNumber <= 20; paperNumber++){

    const shuffled = [...questions].sort(
      () => Math.random() - 0.5
    );

    result.push({
      title:`Mock Paper ${paperNumber}`,
      questions:shuffled.map(q => q.question)
    });

  }

  return result;
}

curriculum.forEach(course => {
  papers[course.id] = createMockPapers(course.id);
});
