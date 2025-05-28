import { useEffect, useState } from "react";
import type { Question } from "../types/Question";
import axios from "axios";

function QuestionsList() {
  const [questions, setQuestions] = useState<Array<Question>>([]);

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

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
      <ol>
        {questions.map((question, idx) => {
          return (
            <li key={question.documentId}>
              <p>{question.Title}</p>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export default QuestionsList;
