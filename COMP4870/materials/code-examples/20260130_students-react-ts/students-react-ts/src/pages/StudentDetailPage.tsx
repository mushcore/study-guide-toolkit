import { useParams } from "react-router-dom";
import StudentList from "../components/StudentList";
import NotFoundPage from "../components/NotFoundPage";
import { useState, useEffect } from "react";
import Config from "../config/";
import { Student } from "../models/Student";

const StudentDetailPage = () => {
    const { id } = useParams();
    const [studentInfo, setStudentInfo] = useState<Student>({
        studentId: 0,
        firstName: "",
        lastName: "",
        school: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`${Config.API_BASE_URL}students/${id}`);
            const body = await result.json();
            //console.log(body);
            setStudentInfo(body);
        };
        fetchData();
    }, [id]);

    if (studentInfo.studentId === 0) return <NotFoundPage />;

    return (
        <section>
            <div style={{ width: "20%", float: "right" }}>
                <h3>Others:</h3>
                <StudentList exceptId={studentInfo.studentId} />
            </div>

            <h4 className="text-muted">Student ID={studentInfo.studentId}</h4>
            <div>
                <b>Name: </b>
                {studentInfo.firstName} {studentInfo.lastName}
            </div>
            <div>
                <b>School: </b>
                {studentInfo.school}
            </div>
        </section>
    );
};

export default StudentDetailPage;
