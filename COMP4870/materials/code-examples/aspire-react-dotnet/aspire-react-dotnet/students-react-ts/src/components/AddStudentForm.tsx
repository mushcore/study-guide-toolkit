import { useState } from "react";
import Config from "../config/";
import { useNavigate } from 'react-router-dom';
import { Student } from "../models/Student";

const AddStudentForm = () => {
    const [studentInfo, setStudentInfo] = useState<Student>({
        studentId: 0,
        firstName: "",
        lastName: "",
        school: "",
    });

    const navigate = useNavigate();

    const addStudent = () => {
        const result = fetch(`${Config.API_BASE_URL}students/`, {
            method: 'post',
            body: JSON.stringify({
                firstName: studentInfo.firstName,
                lastName: studentInfo.lastName,
                school: studentInfo.school,
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        result
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

        navigate('/list', { state: { refresh: true } });
    }
    return (
        <div className="panel panel-default">
            <form>
                <h3>Add Student</h3>
                <div className="form-group">
                    <label>First Name:</label>
                    <input className="form-control" type="text" placeholder="First Name"
                        value={studentInfo.firstName}
                        onChange={(event) => setStudentInfo({ ...studentInfo, firstName: event.target.value })} />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input className="form-control" type="text" placeholder="Last Name"
                        value={studentInfo.lastName}
                        onChange={(event) => setStudentInfo({ ...studentInfo, lastName: event.target.value })} />
                </div>
                <div className="form-group">
                    <label>School:</label>
                    <input className="form-control" type="text" placeholder="School"
                        value={studentInfo.school} onChange={(event) => setStudentInfo({ ...studentInfo, school: event.target.value })} />
                </div>

                <input type="submit"
                    onClick={() => addStudent()} className="btn btn-success" value="Add" />
            </form>
        </div>
    );

}
export default AddStudentForm;
