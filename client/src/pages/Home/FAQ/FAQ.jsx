import Container from "../../../components/Container/Container";

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I apply for a scholarship?',
      answer:
        "Create an account, browse available scholarships, click 'Apply Now', fill out the form, and submit.",
    },
    {
      question: 'Can I apply if I have a back-log in my previous semester?',
      answer:
        'No, You need to clear your back-log.',
    },
    {
      question: 'Can I apply for multiple scholarships?',
      answer:
        'Yes! You can apply for as many scholarships as you are eligible for.',
    },
    {
      question: 'How do I know if I got selected?',
      answer:
        'You can check your application status in your Dashboard. We also send email notifications for updates.',
    },
  ];

  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-gray-500">
            Everything you need to know about Scholarly
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-base-100 border border-base-300"
            >
              <input type="radio" name="my-accordion-2" defaultChecked />
              <div className="collapse-title font-semibold">{faq.question}</div>
              <div className="collapse-content text-sm">{faq.answer}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FAQ;
