import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { Answer } from '../entity/Answer';
import { Category } from '../entity/Category';
import { Question } from '../entity/Question';
import { categoriesList } from '../fixture/CategoriesList';
import IQuestionAndAnswers from '../types/questionAndAnswer';
import axios from 'axios';
const APIKEY: string = process.env.APIKEY!;

export class InitQuestions1630574105254 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const catList = await queryRunner.connection.getRepository(Category).save(categoriesList);

    const questionsList: Question[] = [];
    for (let i = 0; i < 6; ++i) {
      const category = catList[i].name;
      const requstring = `https://quizapi.io/api/v1/questions?apiKey=${APIKEY}&category=${category}`;
      const response = await axios.get(requstring);
      const data: IQuestionAndAnswers[] = await response.data;

      data.forEach((elem) => {
        const createdQuestion = this.createQuestion(elem);
        if (
          createdQuestion !== undefined &&
          !questionsList.find((elem) => elem.text === createdQuestion.text) // Filter unique
        ) {
          questionsList.push(createdQuestion);
        }
      });
    }
    await queryRunner.connection.getRepository(Question).save(questionsList);

    const answersList: Answer[] = [];
    questionsList.forEach((question) => {
      question.answers.forEach((elem) => {
        elem.question = question;
        answersList.push(elem);
      });
    });

    await getRepository(Answer).save(answersList);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.connection.getRepository(Category).clear();
    queryRunner.connection.getRepository(Question).clear();
    queryRunner.connection.getRepository(Answer).clear();
  }

  private createQuestion = (questionAndAnswers: IQuestionAndAnswers) => {
    if (!this.isValidQuestion(questionAndAnswers)) return;

    // The API has categories in its questions, that return an empty object when explicitly asking for questions in that category.
    // For example, some questions are marked with "HTML" as a category but when requesting "HTML" questions the API returns null.
    // The categories in our list have been tested when sent as a parameter to the API.
    const category = categoriesList.find((cat) => cat.name === questionAndAnswers.category);
    if (category === undefined) return;

    const answers = this.createAnswers(questionAndAnswers);

    const question = new Question(
      questionAndAnswers.question,
      answers,
      category,
      answers.find((elem) => {
        elem.isCorrect == true;
      }) as Answer,
    );
    return question;
  };

  private createAnswers = (questionAndAnswers: IQuestionAndAnswers) => {
    const answers: Answer[] = [];

    let k: keyof typeof questionAndAnswers.answers;

    for (k in questionAndAnswers.answers) {
      const answerText: string | undefined = questionAndAnswers.answers[k];
      if (answerText != null) {
        const answerKey = `${k}_correct` as keyof typeof questionAndAnswers.correct_answers; // #JustTypescriptThings
        const isCorrect: boolean = questionAndAnswers.correct_answers[answerKey] === 'true';
        const obj: Answer = new Answer(answerText, isCorrect);
        answers.push(obj);
      }
    }
    return answers;
  };

  private isValidQuestion(questionAndAnswers: IQuestionAndAnswers) {
    // We want to exclude questions with multiple correct answers...
    if (questionAndAnswers.multiple_correct_answers === 'true') return false;

    // ... or no correct answers;
    let k: keyof typeof questionAndAnswers.correct_answers;
    let correctAnswerIndex: number = 0;
    for (k in questionAndAnswers.correct_answers) {
      const answerText: string | undefined = questionAndAnswers.correct_answers[k];
      if (answerText === 'true') break;
      correctAnswerIndex = correctAnswerIndex + 1;
    }
    if (correctAnswerIndex >= 6) return false; // Six entries in the "correct_answers" object, regardless of the number of answers

    return true;
  }
}
