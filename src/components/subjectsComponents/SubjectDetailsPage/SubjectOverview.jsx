/**
 * SubjectOverview Component
 * Displays subject information in a grid layout
 * Separated for better modularity and testability
 */

const InfoCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <p className="text-sm font-semibold text-gray-700">{label}</p>
    <p className="text-gray-600 truncate overflow-hidden whitespace-nowrap">{value}</p>
  </div>
);

const InfoListCard = ({ label, values }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h4 className="text-sm font-semibold text-gray-700 mb-2">{label}</h4>
    {values && values.length > 0 ? (
      <ul className="list-disc pl-5 space-y-1 text-gray-800 text-sm">
        {values.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-sm italic">None</p>
    )}
  </div>
);

const Section = ({ title, icon, children }) => (
  <section className="p-6 border-b border-gray-200 last:border-none">
    <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4 gap-2">
      {icon && <span>{icon}</span>}
      {title}
    </h2>
    {children}
  </section>
);

export const SubjectOverview = ({ subject }) => {
  if (!subject || !subject.curriculum) {
    return null;
  }

  const curriculum = subject.curriculum;

  return (
    <Section title="Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard label="Module" value={curriculum?.module || 'N/A'} />
        <InfoCard label="Level" value={curriculum?.level || 'N/A'} />
        <InfoCard
          label="Teacher"
          value={
            subject.teacherId
              ? subject.teacherId.map((teacher) => `${teacher.firstName} ${teacher.lastName} (${teacher.email})`).join(', ')
              : 'N/A'
          }
        />
        <InfoCard label="Semester" value={curriculum?.semestre || 'N/A'} />
        <InfoCard label="Responsible" value={curriculum?.responsable || 'N/A'} />
        <InfoCard label="Language" value={curriculum?.langue || 'N/A'} />
        <InfoCard label="Total Hours" value={curriculum?.volume_horaire_total || 'N/A'} />
        <InfoCard label="Credits" value={curriculum?.credit || 'N/A'} />
        <InfoCard label="Code" value={curriculum?.code || 'N/A'} />
        <InfoCard label="Academic Year" value={curriculum?.academicYear || 'N/A'} />
        <InfoCard label="Teaching Type" value={curriculum?.type_enseignement || 'N/A'} />
        <InfoListCard label="Prerequisites" values={curriculum?.prerequis_recommandes} />
      </div>
    </Section>
  );
};

