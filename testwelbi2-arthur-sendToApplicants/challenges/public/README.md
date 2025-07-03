# Welbi Technical Challenges

Welcome to the Welbi technical assessment! This collection of challenges is designed to evaluate your skills in building production-ready features for our wellness platform.

## 🎯 About These Challenges

These challenges are built specifically for our Rush monorepo and wellness platform domain. They're designed to:

- **Mirror real work**: Represent actual features you'd build at Welbi
- **Test practical skills**: Focus on production-ready code, not algorithmic puzzles
- **Respect your time**: Provide clear scope and realistic time estimates
- **Match our stack**: Use our exact technology choices and patterns

## 🏗️ Technology Stack

Our challenges use the same stack as our production application:

- **Frontend**: React 19 + TanStack Router + Boomer UI + Vite
- **Backend**: GraphQL (Pothos) + Apollo Server + Node.js
- **Database**: Drizzle ORM + SQLite (dev) / PostgreSQL (prod)
- **Monorepo**: Rush monorepo with shared libraries
- **Permissions**: CASL for authorization (barely implemented)
- **Package Manager**: Bun (preferred) or pnpm

## ⚠️ Important: About Complexity & Expectations

**This codebase is intentionally complex and sometimes messy** - this mirrors real-world development scenarios where you need to understand and work with existing systems that weren't built from scratch.

### What We're Really Assessing
- **Your approach** to understanding complex, unfamiliar codebases
- **Your problem-solving process** when facing overwhelming scope
- **Your ability to prioritize** and focus on what matters most
- **Your communication** about trade-offs and next steps

### Realistic Expectations
- **You likely won't finish everything** - that's completely expected and fine
- **Understanding the codebase is part of the challenge** - take time to explore
- **Document your thought process** - this is as important as working code
- **Focus on demonstrating your approach** rather than perfect completion

## 📋 Challenge Categories

### **Core Full-Stack Challenges (1-5)**
Perfect for full-stack developers looking to demonstrate comprehensive skills:

1. **Event Registration System** - Complete feature development
2. **Advanced Search & Filtering** - Complex data handling
3. **Real-time Notifications** - System architecture
4. **Security Audit & Authorization** - Security focus
5. **Performance Optimization** - Technical depth

### **Infrastructure & DevOps Challenges (6-9)**
Great for engineers with platform/infrastructure interests:

6. **DevOps & CI/CD Pipeline** - Development automation
7. **Authentication System** - Security implementation
8. **Developer Experience Optimization** - Tooling and DX
9. **Testing Infrastructure** - Quality assurance

### **Library Extension Challenges (10-12)**
Build upon our existing library ecosystem:

10. **Internationalization System** - Extend `@testwelbi/locales`
11. **Advanced Permission System** - Extend `@testwelbi/permissions`
12. **Analytics & Tracking** - Extend `@testwelbi/tracking`

### **Micro-Challenges (Bonus)**
Quick skill assessments (15-45 minutes each):

- **Bug Hunt**: Timezone display issues
- **Code Review**: Event registration component
- **API Integration**: Google Calendar sync
- **Bug Fix**: Recent events display

## 🚀 Getting Started

### 1. Environment Setup

Follow the README.md at the root of the repo

### 2. Explore the Codebase

Take 15-30 minutes to familiarize yourself with:

- **Apps**: `/apps/frontend` and `/apps/graphql`
- **Libraries**: `/libs/ui`, `/libs/permissions`, `/libs/time`, etc.
- **Database**: Check existing schema in `/libs/drizzle`
- **Documentation**: Project README and library docs

### 3. Choose Your Challenge(s)

Select based on:
- **Your role interest**: Full-stack, DevOps, Platform Engineering
- **Time available**: Challenges range from 1-4 hours
- **Skill areas**: What you want to demonstrate

## 💡 Tips for Success

### **Code Quality**
- Follow existing patterns and conventions
- Use TypeScript throughout
- Implement proper error handling
- Consider edge cases

### **User Experience**
- Add loading states and error messages
- Implement proper form validation
- Consider accessibility requirements
- Make it responsive

### **Production Readiness**
- Add appropriate tests (when possible)
- Consider performance implications
- Implement proper security measures
- Document your decisions

### **Communication**
- Comment complex logic
- Explain your approach in deliverables
- Note any assumptions or trade-offs
- Suggest future improvements

## 📝 Submission Guidelines

### **What to Submit**

1. **Working Code**: Your implementation (as far as you got)
2. **README.md**: 
   - Your approach and architectural decisions
   - What you accomplished vs. what remains
   - Trade-offs and assumptions you made
   - What you would tackle next with more time
3. **Demo-Ready**: Ensure everything runs with `bun run dev`

### **How to Submit**

1. **Create a `/challenge/application` folder** in your working directory
2. **Copy your work**: Include your documentation
3. **Create a comprehensive README**: Document your journey and decisions
4. **Create a ZIP file**: Package everything into `challenge-<your-name>.zip`
5. **Email the ZIP**: Send to us with a brief summary of what you tackled

### **Time Management**

- **Respect the time estimates**: These are guidelines, don't overspend time.
- **Start with exploration**: Spend time understanding the codebase first
- **Focus on your strengths**: Choose challenges that showcase your skills
- **Document your progress**: Explain what you accomplished and what's next
- **Don't stress about completion**: We're more interested in your process than finishing

## 🤝 Getting Help

### **Technical Issues**
- Check existing code for patterns
- Review library documentation in `/libs/*/README.md`
- Look at similar implementations in the codebase

### **Clarification Questions**
- Email us if requirements are unclear
- Ask about scope if you're unsure
- Confirm your approach if it seems unusual

### **Environment Problems**
- Ensure you're using Node.js 18+
- Try `bun install --force` if dependencies fail
- Check that all required ports are available

## 🎉 What Happens Next

1. **Initial Review**: We'll review your approach and implementation
2. **Technical Interview**: Deep dive into your code, decisions, and problem-solving process
3. **Architecture Discussion**: Talk through what you would do next with more time
4. **System Design**: Explore how you'd scale and improve your solution
5. **Next Steps**: Continue the conversation about joining our team

**The real goal**: Your submission becomes the foundation for a meaningful technical conversation about how you work with complex systems and make architectural decisions.

## 📞 Contact

If you have any questions or run into issues:

- **Email**: [arthur@welbi.co](mailto:arthur@welbi.co)
- **Response Time**: Within 24 hours on business days
- **Urgency**: Mark urgent issues clearly in subject line

---

**Good luck, and we're excited to see what you build!** 🚀

These challenges represent the kind of work you'd do at Welbi - building features that help wellness communities thrive. We're looking forward to seeing your approach and discussing your solutions. 