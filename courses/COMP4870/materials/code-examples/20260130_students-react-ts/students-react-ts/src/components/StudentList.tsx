import { useState, useEffect } from "react";
import { Student } from "../models/Student";
import Config from "../config";
import { Link } from "react-router-dom";
import List from "./List";

type Props = {
    exceptId?: number;
};

const StudentList = ({ exceptId = undefined }: Props) => {

    const [studentInfo, setStudentInfo] = useState<Student[]>([]);

    const getData = async () => {
        const response = await fetch(`${Config.API_BASE_URL}students/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        const jsonData = await response.json();
        setStudentInfo(jsonData);
    };

    useEffect(() => {
        getData();
    }, []);

    let filteredStudents = studentInfo;

    if (exceptId !== undefined) {
        filteredStudents = studentInfo.filter(
            (p: Student) => p.studentId !== +exceptId
        );
    }

    return (
        // <div>
        //     {filteredStudents.map((student: Student, index) => (
        //         <Link to={`/detail/${student.studentId}`}>
        //             <h6 className="text-muted" key={index}>
        //                 {student.studentId} {student.firstName} {student.lastName}
        //             </h6>
        //         </Link>
        //     ))}
        // </div>
        <div>
            <List
                items={filteredStudents}
                render={(student: Student) => (
                    <Link to={`/detail/${student.studentId}`}>
                        <h6 className="text-muted">
                            {student.studentId} {student.firstName} {student.lastName}
                        </h6>
                    </Link>
                )}
            />
        </div>

    );
};

export default StudentList;
