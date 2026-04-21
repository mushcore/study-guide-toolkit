//   /app/controllers/studentController.ts
import * as mongoose from 'mongoose';
import { StudentSchema } from '../models/student';
import { Request, Response } from 'express';

const StudentMongooseModel = mongoose.model('Student', StudentSchema);

export class StudentController {

    public addNewStudent(req: Request, res: Response) {
        let newStudent = new StudentMongooseModel(req.body);

        newStudent.save()
            .then((data: mongoose.Document) => res.json(data))
            .catch((err: mongoose.CallbackError) => res.status(500).send(err));
    }

    public async getStudents(req: Request, res: Response) {
        try {
            const data = await StudentMongooseModel.find({});
            res.json(data);
        } catch (err) {
            res.status(500).send(err);
        }
    }

    public async getStudentById(req: Request, res: Response) {
        try {
            const data = await StudentMongooseModel.findById(req.params.studentId);
            if (!data) {
                return res.status(404).send({ message: 'Student not found' });
            }
            res.json(data);
        } catch (err) {
            res.status(500).send(err);
        }
    }

    public updateStudent(req: Request, res: Response) {
        StudentMongooseModel.findOneAndUpdate({ _id: req.params.studentId }, req.body, { new: true })
            .then((data: any) => res.json(data))
            .catch((err: any) => res.status(500).send(err));
    }

    public async deleteStudent(req: Request, res: Response) {
        try {
            const data = await StudentMongooseModel.findByIdAndDelete(req.params.studentId);
            if (!data) {
                return res.status(404).send({ message: 'Student not found' });
            }
            res.json({ message: 'Successfully deleted student!' });
        } catch (err) {
            res.status(500).send(err);
        }
    }

    public async generateDummyData(req: Request, res: Response) {
        const data = [
            {
                "FirstName": "Sally",
                "LastName": "Baker",
                "School": "Mining",
                "StartDate": new Date("2012-02-20T08:30:00")
            }, {
                "FirstName": "Jason",
                "LastName": "Plumber",
                "School": "Engineering",
                "StartDate": new Date("2018-03-17T17:32:00")
            }, {
                "FirstName": "Sue",
                "LastName": "Gardner",
                "School": "Political Science",
                "StartDate": new Date("2014-06-20T08:30:00")
            }, {
                "FirstName": "Linda",
                "LastName": "Farmer",
                "School": "Agriculture",
                "StartDate": new Date("2014-06-20T08:30:00")
            }, {
                "FirstName": "Fred",
                "LastName": "Fisher",
                "School": "Environmental Sciences",
                "StartDate": new Date("2017-10-16T17:32:00")
            }
        ];

        try {
            const count = await StudentMongooseModel.countDocuments();
            if (count === 0) {
                await StudentMongooseModel.insertMany(data);
                res.json({ message: 'Successfully inserted student data!' });
            } else {
                res.json({ message: 'Collection is not empty, no data inserted.' });
            }
        } catch (error) {
            res.status(500).send(error);
        }

    }
}
