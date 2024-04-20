import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Filter from '../components/Filter.js';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext.js'; // Import the useAuth hook

function Dashboard() {
  const { currentUser } = useAuth(); // Access the current user object from the auth context
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [ongoingTreatments, setOngoingTreatments] = useState([]);
  const [ filters,setFilters] = useState({});

  // Function to calculate time remaining for a treatment
const calculateTimeRemaining = (treatment) => {
  const now = new Date();
  const meetingDate = new Date(treatment.meeting_date);
  const endDate = new Date(meetingDate.getTime() + treatment.treatment_duration * 24 * 60 * 60 * 1000); // Calculate end date based on meeting date and treatment duration
  const timeDiff = endDate - now;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days and round up
  return `${daysRemaining} days`;
};
const handleFilterChange = (name, value) => {
  setFilters((prevFilters) => ({
    ...prevFilters,
    [name]: value,
  }));
  // Perform filtering logic here based on the updated filters state
  console.log("Filters:", filters);
};


useEffect(() => {
  if (currentUser) {
    fetchData(currentUser.uid); // Pass the Firebase UID to the fetchData function
  }
}, [currentUser]);

const fetchData = async (firebaseUid) => {
  try {
    const patientResponse = await axios.get(`http://localhost:8000/backend/patients?firebaseUid=${firebaseUid}`);
    const currentPatient = patientResponse.data[0];
    setPatient(currentPatient);

    const interactionsResponse = await axios.get(`http://localhost:8000/backend/pdinteraction?patientId=${currentPatient.p_id}`);
    const interactionsData = interactionsResponse.data;
    setInteractions(interactionsData);

    // Store interactions data in local storage
    localStorage.setItem('interactions', JSON.stringify(interactionsData));

    const doctorsResponse = await axios.get('http://localhost:8000/backend/doctors');
    setDoctors(doctorsResponse.data);

    // Calculate ongoing treatments
    const now = new Date();
    const ongoing = interactionsData.filter(interaction => {
      const meetingDate = new Date(interaction.meeting_date);
      const formattedDate = meetingDate.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const durationDate = new Date(formattedDate);
      durationDate.setDate(durationDate.getDate() + interaction.treatment_duration);
      return durationDate > now;
    });
    setOngoingTreatments(ongoing);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


  useEffect(() => {
    if (patient && !localStorage.getItem('isReloaded')) {
      // Retrieve interactions data from local storage
      const storedInteractions = JSON.parse(localStorage.getItem('interactions'));
      if (storedInteractions) {
        setInteractions(storedInteractions);

        // Calculate ongoing treatments
        const now = new Date();
        const ongoing = storedInteractions.filter(interaction => {
          const meetingDate = new Date(interaction.meeting_date);
          const formattedDate = meetingDate.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          const durationDate = new Date(formattedDate);
          durationDate.setDate(durationDate.getDate() + interaction.treatment_duration);
          return durationDate > now;
        });
        setOngoingTreatments(ongoing);
      }

      localStorage.setItem('isReloaded', true);
      window.location.reload(); 
    }
  }, [patient]);

  const getDoctorInfo = (doctorId) => {
    const doctor = doctors.find(d => d.d_id === doctorId);
    return doctor ? `${doctor.d_name} (${doctor.d_specialization})` : 'Unknown';
  };

  const toggleDetails = (id) => {
    setInteractions(prevInteractions =>
      prevInteractions.map(interaction =>
        interaction._id === id ? { ...interaction, open: !interaction.open } : interaction
      )
    );
  };

  return (
    <div className="dashboardMainContainer">
      <div className="dashboardContainer">
        {patient && (
          <div className="userInfoContainer">
            <div className="profileImageName">
              <div className="profileImageSection">
                <img src={patient.avatar} alt="" />
              </div>
              <div className="userNameId">
                <span>{patient.p_name}</span> <br />
                {patient.p_id}
              </div>
            </div>
            <div className="userDetails">
              <ul>
                <li>Gender: {patient.p_gender}</li>
                <li>Age: {patient.p_age}</li>
              </ul>
              <ul>
                <li>Blood Group: {patient.p_bloodgroup}</li>
                <li>Address: {patient.p_address}</li>
              </ul>
            </div>

          </div>
        )}
        <div className="userHistorySection">
          <div className="userSideBar">
            <section className="patientInfo">
              <h3>Family History</h3>
              <p>{patient ? patient.Family_History : 'Loading...'}</p>
              <h3>Allergies</h3>
              <p>{patient ? patient.Allergies : 'Loading...'}</p>
              <div className="ongoingTreatments">
                <h3>Ongoing Treatments</h3>
                <ul className="treatmentList">
                  {ongoingTreatments.map(treatment => (
                    <li key={treatment._id} className="treatmentItem">
                      <div className="treatmentInfo">
                        <p className="treatmentName">{treatment.treatment_name}</p>
                        <p className="medicineTaken">Medicine Taken: {treatment.medicines_provided.join(', ')}</p>
                        <p className="timeRemaining">Time Remaining: {calculateTimeRemaining(treatment)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </section>
          </div>
          <div className="userPastRecords">
            <div className="headingandfilter">
            <h2>Past Doctor Visits</h2>
            <Filter onFilterChange={handleFilterChange} />
            </div>
            
            <div className="accordionContainer">
              {interactions.map(interaction => (
                <div key={interaction._id}>
                  <div className="fiterTime">
                    {new Date(interaction.meeting_date).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </div>
                  <div className="accordionSummary" onClick={() => toggleDetails(interaction._id)}>
                    <p>{getDoctorInfo(interaction.d_id)}</p>
                    <p>{interaction.hospital}
                      <FontAwesomeIcon className="accordionArrow" icon={interaction.open ? faCaretUp : faCaretDown} />
                    </p>
                  </div>
                  {interaction.open && (
                    <div className="accordianDetails">
                      <p>Symptoms: {interaction.symptoms.join(', ')}</p>
                      <p>Medicines Provided: {interaction.medicines_provided.join(', ')}</p>
                      <p>Documents: {interaction.documents.join(', ')}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
