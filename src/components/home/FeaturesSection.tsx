import { Search, Users, Shield, Zap, Target, Award } from 'lucide-react'

const features = [
	{
		icon: Search,
		title: 'Smart Job Matching',
		description:
			'Our AI-powered algorithm matches you with jobs that fit your skills, experience, and preferences perfectly.',
	},
	{
		icon: Users,
		title: 'Top Companies',
		description:
			'Connect with leading companies across various industries looking for talented professionals like you.',
	},
	{
		icon: Shield,
		title: 'Secure & Private',
		description:
			'Your personal information is protected with enterprise-grade security and privacy measures.',
	},
	{
		icon: Zap,
		title: 'Quick Applications',
		description:
			'Apply to multiple jobs with just a few clicks using our streamlined application process.',
	},
	{
		icon: Target,
		title: 'Career Growth',
		description:
			'Access resources, tips, and guidance to accelerate your career and professional development.',
	},
	{
		icon: Award,
		title: 'Quality Assurance',
		description:
			'All job postings are verified and reviewed to ensure legitimacy and quality opportunities.',
	},
]

export default function FeaturesSection() {
	return (
		<section className="py-20 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Why Choose FormHire?
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						We've built the most comprehensive job platform to help you find the
						perfect opportunity and companies find the right talent.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => {
						const IconComponent = feature.icon
						return (
							<div
								key={index}
								className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300 group"
							>
								<div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-6 group-hover:bg-primary-200 transition-colors duration-300">
									<IconComponent className="w-6 h-6 text-primary-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-4">
									{feature.title}
								</h3>
								<p className="text-gray-600 leading-relaxed">
									{feature.description}
								</p>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}