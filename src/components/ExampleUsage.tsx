import React from 'react';
import DefaultPage from './DefaultPage';

export default function ExamplePage() {
  const pageData = {
    title: "Example Tool or Technique",
    description: "Detailed explanation of this tool or technique and its importance in cybersecurity.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: "This section provides a comprehensive introduction to the topic, explaining key concepts and fundamental principles."
      },
      {
        id: "usage",
        title: "Basic Usage",
        content: "Learn how to use this tool effectively with step-by-step instructions.",
        commands: [
          "# Basic command example\ncommand --option value",
          "# Advanced usage\ncommand --flag1 value1 --flag2 value2"
        ]
      },
      {
        id: "advanced",
        title: "Advanced Techniques",
        content: "Explore advanced features and techniques for more complex scenarios.",
        commands: [
          "# Advanced example 1\ncommand --advanced-option",
          "# Advanced example 2\ncommand --special-flag"
        ]
      }
    ]
  };

  return <DefaultPage {...pageData} />;
}