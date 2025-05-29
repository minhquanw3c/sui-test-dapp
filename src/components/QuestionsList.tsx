import { useEffect, useState, type FormEventHandler } from "react";
import type { Question } from "../types/Question";
import axios from "axios";
import { Alert, Button, Form } from "react-bootstrap";
import { PinataSDK } from "pinata";
import { useCurrentAccount } from "@mysten/dapp-kit";

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
});

function QuestionsList() {
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const account = useCurrentAccount();

  const fetchQuestions = async () => {
    try {
      const response = (await axios.get(
        `https://phongdinhcms.website/api/questions?populate=*`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_TOKEN}`,
          },
        }
      )) as {
        status: number;
        data: {
          data: Array<Question>;
          meta: {
            pagination: {
              page: number;
              pageSize: number;
              pageCount: number;
              total: number;
            };
          };
        };
      };

      setQuestions(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const missingAnswers: string[] = [];
    const selectedAnswers: Record<string, string> = {};

    questions.forEach((question) => {
      const answer = formData.get(question.documentId);
      if (!answer) {
        missingAnswers.push(question.Title);
      } else {
        selectedAnswers[question.documentId] = answer.toString();
      }
    });

    if (missingAnswers.length > 0) {
      alert(
        `Please answer all questions. Missing: \n${missingAnswers.join("\n")}`
      );
      return;
    }

    const cid = await uploadQuestionAnswersToIPFS(questions, selectedAnswers);

    if (cid) {
    }
  };

  const uploadQuestionAnswersToIPFS = async (
    questions: Array<Question>,
    userAnswers: Record<string, string>
  ): Promise<string | null> => {
    try {
      const uploadRes = await pinata.upload.public
        .json({
          userId: account?.address,
          questions,
          userAnswers,
        })
        .name(`${account?.address}-${Date.now()}`);

      alert("Uploaded user answers");

      return uploadRes.cid;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
      <Form onSubmit={(e) => onFormSubmit(e)} className="d-flex flex-column">
        <ul style={{ listStyleType: "none" }}>
          {questions.map((question, idx) => {
            return (
              <li key={question.documentId} className="mb-3">
                <Alert>
                  <p className="m-0">{`${question.Title}`}</p>
                </Alert>
                {question.Answers.map((answer, idx) => {
                  return (
                    <Form.Check
                      name={`${question.documentId}`}
                      type="radio"
                      label={answer.Title}
                      id={`${question.documentId}-${answer.id}`}
                      key={`${question.documentId}-${answer.id}`}
                      value={answer.Title}
                    />
                  );
                })}
              </li>
            );
          })}
        </ul>

        <Button type="submit" className="ms-auto px-5">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default QuestionsList;
