import axios from 'axios';
import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SkillRegistered() {
  const [users, setUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/getuser')
      .then(response => {
        console.log('Fetched data:', response.data);
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('Fetched data is not an array:', response.data);
        }
      })
      .catch(err => console.log(err));
  }, []);

  // Handle checkbox change for each user
  const handleCheckboxChange = (id) => {
    setCheckedUsers(prevChecked => ({
      ...prevChecked,
      [id]: !prevChecked[id], // Toggle the checkbox state
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const attendances = users.map(user => ({
      name: user.name,
      status: checkedUsers[user._id] || false, // True if checked, false if not
    }));

    console.log("Submitting attendances: ", attendances);

    try {
      const res = await axios.post('http://localhost:3000/api/attendences', attendances);
      if (res.status === 200) {
        console.log("Attendance data saved successfully");
        navigate('/dashboard');
      } else {
        console.log("Unexpected status code:", res.status);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Skill Registered Users</h2>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Attendance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Dept</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Skill</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={checkedUsers[user._id] || false}
                        onChange={() => handleCheckboxChange(user._id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.dept}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.skill}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-sm text-gray-500 text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Button className='bg-slate-700 ml-5' onClick={handleSubmit}>SUBMIT</Button>
    </div>
  );
}
