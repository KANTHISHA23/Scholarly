import { Quote, GraduationCap, ArrowRight, User } from "lucide-react";
import { Link } from "react-router";
import Container from "../../components/Container/Container";

const SuccessStories = () => {
 const stories = [
   {
     id: 1,
     name: 'Isha Kanth',
     university: 'UCET, Vinoba Bhave University',
     scholarship: 'Reliance Foundation & HDFC Badhte Kadam',
     // Lorelei style: Neutral, clean, and modern
     image:
       'https://api.dicebear.com/7.x/lorelei/svg?seed=Isha&backgroundColor=b6e3f4',
     quote:
       'Navigating the documentation for HDFC Badhte Kadam and Reliance UG scholarships was seamless.',
     year: '2023 & 2024',
     degree: 'B.Tech - Computer Science & Engineering',
     schemeType: 'Private + Corporate CSR',
   },
   {
     id: 2,
     name: 'Aarav Mehra',
     university: 'Government Engineering College',
     scholarship: 'AICTE Saksham Scholarship',
     image:
       'https://api.dicebear.com/7.x/lorelei/svg?seed=Aarav&backgroundColor=c0aede',
     quote:
       'The Saksham scheme provides financial support for lab equipment required for my ECE projects.',
     year: '2024',
     degree: 'B.Tech - Electronics & Communication',
     schemeType: 'Government (AICTE)',
   },
   {
     id: 3,
     name: 'Sandeep Kumar',
     university: 'IIT Kanpur',
     scholarship: 'ONGC Scholarship for SC/ST/OBC Students',
     image:
       'https://api.dicebear.com/7.x/lorelei/svg?seed=Sandeep&backgroundColor=d1d4f9',
     quote:
       'The ONGC grant allowed me to focus on my internship without worrying about semester fees.',
     year: '2024',
     degree: 'B.Tech - Mechanical Engineering',
     schemeType: 'Public Sector Undertaking (PSU)',
   },
   {
     id: 4,
     name: 'Megha Singh',
     university: 'Delhi Technological University',
     scholarship: 'Tata Trust Professional Enhancement Grant',
     image:
       'https://api.dicebear.com/7.x/lorelei/svg?seed=Megha&backgroundColor=ffd5dc',
     quote:
       'Tata Trust scholarships are vital for core branches. The process through Scholarly was transparent.',
     year: '2023',
     degree: 'B.Tech - Civil Engineering',
     schemeType: 'Private Trust',
   },
   {
     id: 5,
     name: 'Vikram Aditya',
     university: 'BITS Pilani',
     scholarship: "Prime Minister's Scholarship Scheme (PMSS)",
     image:
       'https://api.dicebear.com/7.x/lorelei/svg?seed=Vikram&backgroundColor=ffdfbf',
     quote:
       'PMSS ensures that children of martyrs can pursue technical education at top Indian institutes.',
     year: '2023',
     degree: 'B.Tech - Electrical Engineering',
     schemeType: 'Central Government',
   },
   {
     id: 6,
     name: 'Riya Das',
     university: 'Anna University',
     scholarship: 'L&T Build India Scholarship',
     image:
       'https://api.dicebear.com/7.x/lorelei/svg?seed=Riya&backgroundColor=c0eaf8',
     quote:
       'This portal helped me understand the eligibility for the M.Tech sponsorship program.',
     year: '2025',
     degree: 'B.Tech - Instrumentation & Control',
     schemeType: 'Corporate CSR',
   },
 ];

  return (
    <div className='bg-base-200 min-h-screen'>
      {/* Hero Section */}
      <div className='bg-primary text-primary-content py-20'>
        <Container>
          <div className='text-center max-w-3xl mx-auto'>
            <h1 className='text-4xl md:text-5xl font-bold mb-6'>
              Success Stories
            </h1>
            <p className='text-lg opacity-90'>
              Meet the brilliant minds who transformed their dreams into reality
              these scholarships. Their journeys inspire us every day.
            </p>
          </div>
        </Container>
      </div>

      <Container className='py-16'>
        {/* Stats Section */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-16'>
          {[
            { label: 'Students Impacted', value: '4.5 Lakh+' },
            { label: 'Total Disbursement', value: '₹120 Cr+' },
            { label: 'Listed Schemes', value: '1,200+' },
            { label: 'Colleges Covered', value: '3,500+' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className='stat bg-base-100 shadow-lg rounded-xl text-center'
            >
              <div className='stat-value text-primary text-3xl md:text-4xl'>
                {stat.value}
              </div>
              <div className='stat-desc text-base font-medium mt-1'>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Stories Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {stories.map((story) => (
            <div
              key={story.id}
              className='card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group'
            >
              <div className='card-body relative'>
                {/* Quote Icon */}
                <div className='absolute top-4 right-4 text-primary/10'>
                  <Quote size={60} />
                </div>

                {/* User Profile */}
                <div className='flex items-center gap-4 mb-4'>
                  <div className='avatar'>
                    <div className='w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
                      <img src={story.image} alt={story.name} />
                    </div>
                  </div>
                  <div>
                    <h3 className='font-bold text-lg'>{story.name}</h3>
                    <p className='text-sm text-gray-500'>
                      {story.year} Scholar
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <p className='text-gray-600 italic mb-6 relative z-10'>
                  "{story.quote}"
                </p>

                {/* Scholarship Info */}
                <div className='mt-auto pt-4 border-t border-base-200'>
                  <div className='flex items-start gap-2 mb-2'>
                    <GraduationCap className='size-5 text-primary shrink-0 mt-1' />
                    <div>
                      <p className='font-semibold text-primary'>
                        {story.university}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {story.scholarship}
                      </p>
                    </div>
                  </div>
                  <div className='badge badge-outline badge-sm mt-2'>
                    {story.degree}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className='mt-20'>
          <div className='card bg-base-100 shadow-xl overflow-hidden'>
            <div className='card-body p-10 text-center'>
              <h2 className='text-3xl font-bold mb-4'>
                Ready to Write Your Own Success Story?
              </h2>
              <p className='text-gray-500 max-w-2xl mx-auto mb-8'>
                Join thousands of students who have found their perfect
                scholarship match. Your journey to a best education
                starts here.
              </p>
              <div className='flex flex-col sm:flex-row justify-center gap-4'>
                <Link
                  to='/scholarships'
                  className='btn btn-primary btn-lg gap-2'
                >
                  Find Scholarships <ArrowRight className='size-5' />
                </Link>
                <Link to='/signUp' className='btn btn-outline btn-lg'>
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SuccessStories;
