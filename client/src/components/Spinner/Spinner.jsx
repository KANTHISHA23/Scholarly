import Lottie from "lottie-react";
import Loading from "../../assets/animations/Loading.json";
const Spinner = () => {
  return (
    <div className={`h-[calc(100vh-120px)] flex items-center justify-center`}>
      <Lottie animationData={Loading} loop />
    </div>
  );
};

export default Spinner;
