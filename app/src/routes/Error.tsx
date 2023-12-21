import { useRouteError } from "react-router-dom";
import Header from "../components/Header";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <>
      <Header headerText="Sorry, that's an Error" subTitleText="Sorry, an unexpected error has occurred." />
      <div className="mb-5">
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </>
  );
}