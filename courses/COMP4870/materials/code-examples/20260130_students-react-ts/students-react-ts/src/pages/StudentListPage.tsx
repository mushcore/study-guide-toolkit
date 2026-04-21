import StudentList from "../components/StudentList";
import AddStudentForm from "../components/AddStudentForm";

const StudentListPage = () => {
    return (
        <section>
            <h1>Student List Page</h1>
            <AddStudentForm />
            <StudentList />
        </section>
    );
};
export default StudentListPage;
