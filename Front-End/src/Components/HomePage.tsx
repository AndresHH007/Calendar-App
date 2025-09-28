import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const list = [
    { title: "Calender View", linkto: "/calender" },
    { title: "Timeline View", linkto: "/timeline" },
  ];
  return (
    <div className="min-h-screen bg-base-100">
      <div className="rounded-box bordered border-2">
        <div className="p-2 text-center">Applications</div>
        {list.map((item) => (
          <div
            className="m-2 p-2 hover:bg-base-300 bg-base-200 rounded-box"
            onClick={() => navigate(item.linkto)}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};
