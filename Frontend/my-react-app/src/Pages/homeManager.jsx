import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { FileText } from 'lucide-react';
import Header from "../Components/headerManager.jsx";
import Card from "../Components/card.jsx";
import Footer from "../Components/footer.jsx";
import applicationBg from "../assets/applications.svg";
import policiesBg from "../assets/policies.svg";
import tutorialsBg from "../assets/tuteorials.svg";
import circularsBg from "../assets/circulars.svg";
import memos_bg from "../assets/memos_bg.svg"; 
import {
  faFileLines,
  faFileShield,
  faPersonChalkboard,
  faFilePen,
} from "@fortawesome/free-solid-svg-icons";

const MoneyPattern = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex flex-wrap gap-6 p-2">
        {Array.from({ length: 2000 }).map((_, i) => (
          <FileText
            key={i}
            className={`w-6 h-6 opacity-15 transform ${
              i % 2 === 0 ? 'text-blue-500' : 'text-purple-500'
            }`}
            style={{
              transform: `rotate(${Math.random() * 180}deg)`
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <div className="flex flex-1 flex-col sm:flex-row bg-cover bg-center">
        <main className="flex-1 p-8 lg:p-24 bg-[#FFFFFF] relative">
          <MoneyPattern />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            <Card
              icon={faFileLines}
              title={<span className="text-4xl font-bold">Circulars</span>}
              content={
                <p className="text-lg text-center leading-relaxed">
                  Stay informed with the latest official announcements and updates.
                  Circulars provide crucial information regarding company policies,
                  procedural changes, and important notices.
                </p>
              }
              cardImage={circularsBg}
              bgColor="bg-[#e6f3ff]/90"
              textColor="text-blue-900"
              hoverColor="hover:bg-blue-100"
              buttonText="View"
              buttonColor="bg-blue-500 hover:bg-blue-600"
              buttonTextColor="text-white"
              onClick={() => navigate('/circulars')}
              backgroundImage={circularsBg}
            />

            <Card
              icon={faFileShield}
              title={<span className="text-4xl font-bold">Policies</span>}
              bgColor="bg-[#ffe6e6]/90"
              textColor="text-red-900"
              hoverColor="hover:bg-red-100"
              content={
                <p className="text-lg text-center leading-relaxed">
                  Our policies outline the rules and guidelines governing our operations
                  and employee conduct. <span className="text-red-500">
                    Note: These documents are confidential, and unauthorized access or sharing is strictly prohibited.
                  </span>
                </p>
              }
              cardImage={policiesBg}
              buttonText="View"
              buttonColor="bg-blue-500 hover:bg-blue-600"
              buttonTextColor="text-white"
              onClick={() => navigate('/policies')}
              backgroundImage={policiesBg}
            />

            <Card
              icon={faPersonChalkboard}
              title={<span className="text-4xl font-bold">Tutorials</span>}
              bgColor="bg-[#fff7e6]/90"
              textColor="text-yellow-900"
              hoverColor="hover:bg-yellow-100"
              content={
                <p className="text-lg text-center leading-relaxed">
                  Enhance your skills with step-by-step guides and instructional content.
                  These tutorials cover a range of topics designed to help you navigate
                  various tools and processes efficiently.
                </p>
              }
              cardImage={tutorialsBg}
              buttonText="View"
              buttonColor="bg-blue-500 hover:bg-blue-600"
              buttonTextColor="text-white"
              onClick={() => navigate('/tutorials')}
              backgroundImage={tutorialsBg}
            />

            <Card
              icon={faFilePen}
              title={<span className="text-4xl font-bold">Applications</span>}
              bgColor="bg-[#e6ffe6]/90"
              textColor="text-green-900"
              hoverColor="hover:bg-green-100"
              content={
                <p className="text-lg text-center leading-relaxed">
                  Access a range of internal applications designed to streamline your work
                  processes. These tools are essential for day-to-day tasks and ensure
                  efficient operation within the organization.
                </p>
              }
              cardImage={applicationBg}
              buttonText="View"
              buttonColor="bg-blue-500 hover:bg-blue-600"
              buttonTextColor="text-white"
              onClick={() => navigate('/applications')}
              backgroundImage={applicationBg}
            />

<Card
              icon={faFilePen}
              title={<span className="text-4xl font-bold">Memos</span>}
              bgColor="bg-purple-200"
              textColor="text-purple-900"
              hoverColor="hover:text-green-100"
              content={ <p className="text-lg text-center leading-relaxed">Access a range of internal applications designed to streamline your work processes. 
                These tools are essential for day-to-day tasks and ensure efficient operation within the organization.</p>}
              cardImage={memos_bg}
              buttonText="View"
              buttonColor="bg-blue-500"
              buttonTextColor="text-white"
              onClick = {() => navigate('/memos')}
              backgroundImage={memos_bg}
            />

            
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
