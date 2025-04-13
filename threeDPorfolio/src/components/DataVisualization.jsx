import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Generate GitHub-style contribution data
const generateContributionData = () => {
  // Create data for a year (52 weeks × 7 days = 364 cells)
  const weeks = 52;
  const days = 7;

  const data = [];

  // Generate patterns that resemble real contribution activity
  for (let week = 0; week < weeks; week++) {
    const weekData = [];

    for (let day = 0; day < days; day++) {
      // Create patterns - more active in the recent months, less in earlier months
      let intensity = 0;

      if (week > 40) {
        // Most recent weeks - higher activity
        intensity = Math.random() > 0.5 ? Math.floor(Math.random() * 4) + 1 : 0;
        // Create some "streaks" of contributions
        if (day > 0 && weekData[day - 1] > 0 && Math.random() > 0.3) {
          intensity = Math.min(
            4,
            weekData[day - 1] + Math.floor(Math.random() * 2)
          );
        }
        // Weekends have less activity
        if ((day === 0 || day === 6) && Math.random() > 0.3) {
          intensity = 0;
        }
      } else if (week > 30) {
        // Medium activity period
        intensity = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
      } else {
        // Earlier period - less activity
        intensity =
          Math.random() > 0.85 ? Math.floor(Math.random() * 2) + 1 : 0;
      }

      weekData.push(intensity);
    }

    data.push(weekData);
  }

  return data;
};

const DataVisualization = ({ className = "" }) => {
  const [contributionData, setContributionData] = useState([]);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [activeDay, setActiveDay] = useState(null);
  const [activeBand, setActiveBand] = useState(null); // For skill bars
  const containerRef = useRef(null);

  // Generate GitHub contribution data on mount
  useEffect(() => {
    setContributionData(generateContributionData());
  }, []);

  // Get the month labels for the contribution graph
  const getMonthLabels = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const labels = [];

    // Generate month labels at approximate positions
    for (let i = 0; i < 12; i++) {
      labels.push({
        label: months[i],
        position: i * 4.333, // Approximate position (52 weeks / 12 months)
      });
    }

    return labels;
  };

  // For the skill bars animation
  const skillLevels = [
    { name: "JavaScript/TypeScript", level: 90 },
    { name: "React/React Native", level: 95 },
    { name: "Three.js/WebGL", level: 80 },
    { name: "Node.js/Express", level: 85 },
    { name: "Tailwind CSS", level: 90 },
    { name: "MongoDB/SQL", level: 75 },
  ];

  return (
    <>
      <div
        className={`bg-gray-900 rounded-lg shadow-xl overflow-hidden p-6 ${className}`}
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-200 mb-6">
            GitHub Contributions
          </h3>

          <div
            ref={containerRef}
            className="overflow-x-auto py-2"
            onMouseLeave={() => setHoverInfo(null)}
          >
            <div className="relative min-w-[900px]">
              {/* Month labels */}
              {/* <div className="flex text-xs text-gray-400 mb-2 pl-10">
              {getMonthLabels().map((month, i) => (
                <div
                  key={`month-${i}`}
                  className="flex-shrink-0"
                  style={{ width: `${month.position * 1.9}%` }}
                >
                  {month.label}
                </div>
              ))}
            </div> */}

              {/* Day labels */}
              <div className="flex">
                <div className="flex flex-col items-start justify-around text-xs text-gray-400 pr-2 h-[120px]">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                {/* Contribution cells */}
                <div className="flex flex-1">
                  {contributionData.map((week, weekIndex) => (
                    <div key={`week`} className="flex flex-col gap-1">
                      {week.map((intensity, dayIndex) => {
                        // Map intensity (0-4) to CSS classes for colors
                        const colorClasses = [
                          "bg-gray-800", // 0 - No contributions
                          "bg-green-900", // 1 - Few contributions
                          "bg-green-700", // 2 - Some contributions
                          "bg-green-600", // 3 - More contributions
                          "bg-green-500", // 4 - Most contributions
                        ];

                        // Create fake date for hover tooltip
                        const date = new Date();
                        date.setDate(
                          date.getDate() -
                            ((51 - weekIndex) * 7 + (6 - dayIndex))
                        );

                        return (
                          <motion.div
                            key={`day-${weekIndex}-${dayIndex}`}
                            className={`w-3 h-3 rounded-sm ${colorClasses[intensity]} hover:ring-1 hover:ring-white/30 cursor-pointer mx-1`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: 0.01,
                              delay: (weekIndex * 7 + dayIndex) * 0.001,
                            }}
                            onMouseEnter={() => {
                              setHoverInfo({
                                date: date.toLocaleDateString("en-US", {
                                  // year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }),
                                count:
                                  intensity === 0
                                    ? "No contributions"
                                    : intensity === 1
                                    ? "1-2 contributions"
                                    : intensity === 2
                                    ? "3-5 contributions"
                                    : intensity === 3
                                    ? "6-9 contributions"
                                    : "10+ contributions",
                                position: { week: weekIndex, day: dayIndex },
                              });
                              setActiveDay({ week: weekIndex, day: dayIndex });
                            }}
                            onMouseLeave={() => setActiveDay(null)}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tooltip */}
            {hoverInfo && activeDay && (
              <div
                className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg z-10"
                style={{
                  left: `${activeDay.week * 20 + 50}px`,
                  top: `${activeDay.day * 18 + 10}px`,
                }}
              >
                <div className="font-semibold">{hoverInfo.date}</div>
                <div>{hoverInfo.count}</div>
              </div>
            )}

            {/* Contribution legend */}
            <div className="flex items-center justify-end mt-2 text-xs text-gray-400 gap-2">
              <span>Less</span>
              <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-900 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Bars */}
      <div className="mt-12 mb-40">
        <h3 className="text-xl font-semibold text-gray-200 mb-6">
          Skill Proficiency
        </h3>

        <div className="space-y-4">
          {skillLevels.map((skill, index) => (
            <div
              key={`skill-${index}`}
              className="relative"
              onMouseEnter={() => setActiveBand(index)}
              onMouseLeave={() => setActiveBand(null)}
            >
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">{skill.name}</span>
                <span className="text-blue-400">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.2,
                    ease: "easeOut",
                  }}
                />
              </div>

              {/* Active skill highlight */}
              {activeBand === index && (
                <motion.div
                  className="absolute inset-0 rounded-md ring-2 ring-blue-500/50 -m-1 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DataVisualization;
