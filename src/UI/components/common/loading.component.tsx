import React from "react";
import Lottie from "lottie-react";
import sandyLoadingAnimation from "../../../assets/sandy-loading.json";
import classicLoadingAnimation from "../../../assets/classic-loading.json";

interface LoadingProps {
  variant?: "sandy" | "classic";
  size?: "small" | "medium" | "large";
  className?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = "classic",
  size = "medium",
  className = "",
  text,
}) => {
  const animationData =
    variant === "sandy" ? sandyLoadingAnimation : classicLoadingAnimation;

  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        className={sizeClasses[size]}
        style={{
          width: size === "small" ? 32 : size === "medium" ? 64 : 96,
          height: size === "small" ? 32 : size === "medium" ? 64 : 96,
        }}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
};

export default Loading;
