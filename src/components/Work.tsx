import { useState, useCallback } from "react";
import "./styles/Work.css";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Cloud Native / DevOps",
    tools: "AWS, Kubernetes, Docker, GitHub Actions, Grafana, Prometheus",
    description:
      "Architected and deployed a fully cloud-native e-commerce platform on AWS, leveraging Kubernetes for container orchestration with a private image registry. Implemented a CI/CD pipeline via GitHub Actions with blue-green deployment logic for zero-downtime releases. Integrated Grafana and Prometheus for real-time performance monitoring and alerting.",
  },
  {
    title: "NutriHelp",
    category: "Capstone Project",
    tools: "React, Node.js, Supabase, PDF Export",
    description:
      "Built a sustainability-focused meal-planning app with recipe selection and PDF ingredient exports. Served as Technical Lead, coordinating frontend integration and team deliverables across multiple groups. Presented at InnoFes, receiving strong recognition for innovation and real-world impact.",
  },
  {
    title: "Attendance System",
    category: "Computer Vision",
    tools: "Python, Flask, OpenCV, Pandas",
    description:
      "Developed a face recognition attendance system automating user check-ins and CSV record keeping using OpenCV and Pandas.",
  },
  {
    title: "SHIVOT Chatbot",
    category: "AI / NLP",
    tools: "Python, OpenAI API, NLP",
    description:
      "Built an intelligent chatbot leveraging OpenAI for query responses, applying NLP and conversational AI techniques.",
  },
  {
    title: "News Aggregator",
    category: "Full Stack Web App",
    tools: "Django, SQL, REST APIs",
    description:
      "Developed a Django + SQL platform delivering category-based news feeds via APIs, with user registration, payments, and database integration.",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Projects</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                        <p className="carousel-description">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
