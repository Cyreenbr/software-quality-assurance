/**
 * SkillsSection Component
 * Displays subject skills in a grid layout
 * Separated for better modularity
 */

const Section = ({ title, icon, children }) => (
  <section className="p-6 border-b border-gray-200 last:border-none">
    <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4 gap-2">
      {icon && <span>{icon}</span>}
      {title}
    </h2>
    {children}
  </section>
);

const SkillCard = ({ title, families }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <p className="text-sm font-semibold text-gray-700">{title}</p>
    <ul className="text-gray-600 text-xs mt-2 space-y-1">
      {families.map((family, index) => (
        <li key={index}>• {family}</li>
      ))}
    </ul>
  </div>
);

const EmptyState = ({ message }) => <p className="text-sm text-gray-500 text-center py-4">{message}</p>;

export const SkillsSection = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return (
      <Section title="Skills">
        <EmptyState message="No skills available." />
      </Section>
    );
  }

  return (
    <Section title="Skills">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <SkillCard
            key={index}
            title={skill.title}
            families={skill.familyId.map((family) => family.title)}
          />
        ))}
      </div>
    </Section>
  );
};

