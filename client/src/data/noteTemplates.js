export const noteTemplates = [
  {
    id: 'blank',
    name: 'Blank Note',
    description: 'Start with a clean slate',
    icon: '📝',
    title: '',
    content: '',
    tags: []
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Structure for meeting documentation',
    icon: '👥',
    title: 'Meeting - [Topic]',
    content: `## Attendees
- 

## Agenda
1. 
2. 
3. 

## Discussion Points


## Action Items
- [ ] 
- [ ] 

## Next Steps


## Notes
`,
    tags: ['Work', 'Meetings']
  },
  {
    id: 'daily',
    name: 'Daily Journal',
    description: 'Daily reflection and planning',
    icon: '📅',
    title: `Daily Journal - ${new Date().toLocaleDateString()}`,
    content: `## Today's Focus
🎯 Main Goal: 

## Grateful For
1. 
2. 
3. 

## What I Did Today


## Challenges Faced


## Tomorrow's Priorities
- [ ] 
- [ ] 
- [ ] 

## Evening Reflection
`,
    tags: ['Personal', 'Reflection']
  },
  {
    id: 'project',
    name: 'Project Planning',
    description: 'Plan and track projects',
    icon: '🚀',
    title: 'Project: [Name]',
    content: `## Project Overview


## Goals & Objectives
- 
- 

## Timeline
- Start Date: 
- Target Completion: 

## Milestones
1. [ ] 
2. [ ] 
3. [ ] 

## Resources Needed


## Risks & Challenges


## Success Metrics


## Notes
`,
    tags: ['Work', 'Goals']
  },
  {
    id: 'learning',
    name: 'Learning Notes',
    description: 'Study and learning documentation',
    icon: '📚',
    title: 'Learning: [Topic]',
    content: `## Topic Overview


## Key Concepts
- 
- 
- 

## Detailed Notes


## Examples


## Questions to Explore
- 
- 

## Resources
- 
- 

## Summary


## Next Steps
`,
    tags: ['Learning', 'Ideas']
  },
  {
    id: 'idea',
    name: 'Idea Brainstorm',
    description: 'Capture and develop ideas',
    icon: '💡',
    title: 'Idea: [Title]',
    content: `## The Idea
🌟 Core Concept: 

## Why This Matters


## Potential Applications
- 
- 
- 

## Pros & Cons
**Pros:**
- 

**Cons:**
- 

## Next Steps to Explore
1. 
2. 
3. 

## Related Ideas


## Resources & Inspiration
`,
    tags: ['Ideas', 'Creativity']
  },
  {
    id: 'book',
    name: 'Book Notes',
    description: 'Document book insights',
    icon: '📖',
    title: 'Book: [Title] by [Author]',
    content: `## Book Information
- **Author:** 
- **Published:** 
- **Genre:** 

## Summary


## Key Takeaways
1. 
2. 
3. 

## Favorite Quotes
> 

> 

## Chapter Notes


## My Thoughts & Reflections


## Action Items
- [ ] 
- [ ] 

## Related Books/Resources
`,
    tags: ['Learning', 'Reflection']
  },
  {
    id: 'goal',
    name: 'Goal Setting',
    description: 'Define and track goals',
    icon: '🎯',
    title: 'Goal: [Your Goal]',
    content: `## Goal Statement
🎯 I will [specific goal] by [deadline]

## Why This Goal Matters


## Current Situation


## Success Criteria
- [ ] 
- [ ] 
- [ ] 

## Action Plan
1. [ ] 
2. [ ] 
3. [ ] 

## Potential Obstacles & Solutions
**Obstacle:** 
**Solution:** 

## Resources Needed


## Milestones & Timeline
- Week 1: 
- Week 2: 
- Week 3: 

## Progress Tracking


## Celebration Plan
`,
    tags: ['Goals', 'Personal']
  },
  {
    id: 'recipe',
    name: 'Recipe',
    description: 'Document recipes and cooking notes',
    icon: '🍳',
    title: 'Recipe: [Dish Name]',
    content: `## Recipe Details
- **Prep Time:** 
- **Cook Time:** 
- **Servings:** 
- **Difficulty:** 

## Ingredients
- 
- 
- 

## Instructions
1. 
2. 
3. 

## Tips & Notes


## Variations


## Nutrition Info


## Source/Credit
`,
    tags: ['Food']
  },
  {
    id: 'travel',
    name: 'Travel Planning',
    description: 'Plan trips and document travels',
    icon: '✈️',
    title: 'Travel: [Destination]',
    content: `## Trip Overview
- **Destination:** 
- **Dates:** 
- **Travel Companions:** 

## Itinerary
**Day 1:**
- 

**Day 2:**
- 

## Accommodation


## Transportation


## Budget
- Flights: 
- Accommodation: 
- Food: 
- Activities: 
- **Total:** 

## Packing List
- [ ] 
- [ ] 

## Places to Visit
- 
- 

## Restaurants to Try
- 
- 

## Important Info
- Confirmations: 
- Emergency Contacts: 

## Memories & Photos
`,
    tags: ['Travel', 'Personal']
  },
  {
    id: 'retrospective',
    name: 'Retrospective',
    description: 'Reflect on past experiences',
    icon: '🔄',
    title: 'Retrospective: [Period/Project]',
    content: `## Period/Project
From: [Start Date] To: [End Date]

## What Went Well 😊
- 
- 
- 

## What Could Be Improved 🤔
- 
- 
- 

## What I Learned 📚
- 
- 
- 

## Surprises & Unexpected Outcomes


## Actions for Next Time
- [ ] 
- [ ] 
- [ ] 

## Overall Reflection


## Gratitude
`,
    tags: ['Reflection', 'Work']
  }
];

export const getTemplateById = (id) => {
  return noteTemplates.find(template => template.id === id);
};

export const getTemplateCategories = () => {
  const categories = {
    'Personal': noteTemplates.filter(t => ['daily', 'goal', 'travel', 'recipe'].includes(t.id)),
    'Work': noteTemplates.filter(t => ['meeting', 'project', 'retrospective'].includes(t.id)),
    'Learning': noteTemplates.filter(t => ['learning', 'book', 'idea'].includes(t.id)),
    'Other': noteTemplates.filter(t => t.id === 'blank')
  };
  return categories;
};
