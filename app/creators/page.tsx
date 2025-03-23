import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Head from 'next/head';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

interface CreatorProps {
    name: string;
    role: string;
    bio: string;
    github: string;
    linkedin: string;
    imageSrc: string;
}

const Creator: React.FC<CreatorProps> = ({ name, role, bio, github, linkedin, imageSrc }) => {
    return (
        <div className="flex flex-col md:flex-row items-center bg-slate-800 bg-opacity-30 rounded-lg p-6 backdrop-blur-sm border border-slate-700 hover:border-slate-500 transition-all duration-300">
            <div className="w-36 h-36 md:w-48 md:h-48 relative rounded-full overflow-hidden border-4 border-slate-700 mb-4 md:mb-0 md:mr-8">
                <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
                <p className="text-emerald-400 text-lg mb-4">{role}</p>
                <p className="text-slate-300 mb-6">{bio}</p>
                <div className="flex space-x-4">
                    <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-slate-300 hover:text-white transition-colors duration-200"
                    >
                        <FaGithub className="mr-2 text-xl" />
                        <span>GitHub</span>
                    </a>
                    <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-slate-300 hover:text-white transition-colors duration-200"
                    >
                        <FaLinkedin className="mr-2 text-xl" />
                        <span>LinkedIn</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

const CreatorsPage: React.FC = () => {
    const creators = [
        {
            name: "Jeet Sarkar",
            role: "Data Scientist and Web Developer",
            bio: " Tech enthusiast with expertise in ML, DL, NLP, Web Development, and DSA. Skilled in integrating Arduino and ESP microcontrollers for IoT projects and hardware-software solutions. Passionate about building scalable systems and solving complex problems.",
            github: "https://github.com/Ironsoldier353",
            linkedin: "https://www.linkedin.com/in/jeet-sarkar-4a4694323/",
            imageSrc: "/images/jeet-sarkar.jpeg"
        },
        {
            name: "Sayan Das",
            role: "Full Stack Web Developer and ML Engineer",
            bio: "Versatile Machine Learning Engineer and Full Stack Developer with expertise in developing AI-powered applications using Python, TensorFlow, Keras and the MERN stack (MongoDB, Express.js, React.js, Node.js) or Next.js. Experienced in building predictive models, data visualization, and implementing ML algorithms in web applications.  Seeking to leverage technical expertise in machine learning and web development for innovative AI-driven projects.",
            github: "https://github.com/SayanDas07",
            linkedin: "https://www.linkedin.com/in/sayan-das-643a85252/",
            imageSrc: "/images/sayan-das.jpeg"
        },

    ];

    return (
        <div>
            <nav className="w-full px-6 py-4 border-white/10  bg-gradient-to-b from-slate-950 to-slate-900">
                <div className="max-w-auto mx-auto flex items-center justify-between">
                    <Link href="/">
                        <div className="flex items-center gap-2">
                            <div className="relative w-10 h-10">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-sm"></div>
                                <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
                                    <BookOpen className="h-5 w-5 text-blue-400" />
                                </div>
                            </div>
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                Code Morph
                            </span>
                        </div>
                    </Link>

                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <span className="text-5xl font-bold text-white mb-4 tracking-tight">
                            The Creators Page
                        </span>
                    </div>


                </div>
            </nav>
            <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-16 px-4 sm:px-6 lg:px-8">

                <Head>
                    <title>Project Code Morph - Creators</title>
                    <meta name="description" content="Meet the creators of Project Code Morph - a platform for visualizing and mastering Data Structures & Algorithms" />
                </Head>

                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">

                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Meet the team behind <span className="text-emerald-400 font-semibold">Project Code Morph</span> -
                            bringing data structures and algorithms to life through intuitive visualizations.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {creators.map((creator, index) => (
                            <Creator key={index} {...creator} />
                        ))}
                    </div>


                </div>

            </div>
            <div>
                <p className="bg-gradient-to-b from-slate-950 to-slate-900 text-white text-sm px-10 py-5">© {new Date().getFullYear()} CodeMorph. All rights reserved.</p>
            </div>
        </div>

    );
};

export default CreatorsPage;