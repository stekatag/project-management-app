import { SVGAttributes } from "react";

type LogoVariant = "default" | "circular";
interface ApplicationLogoProps extends SVGAttributes<SVGElement> {
  variant?: LogoVariant;
}

const DefaultLogo = (props: SVGAttributes<SVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="team">
    <path d="m31.203 7.161-2.475 2.475-5.657-5.656 2.475-2.476a.5.5 0 0 0-.707-.707l-.353.353-5.303 5.304a.5.5 0 0 0 0 .707l.354.354-.73.73-.467.465-1.828-.609a.502.502 0 0 0-.512.121l-.354-.354a1.537 1.537 0 0 0-1.708-.294l-.767-.767.353-.353a.5.5 0 0 0 0-.707L8.222.443 7.868.09a.5.5 0 0 0-.707.707l2.475 2.476-5.657 5.656-2.475-2.475a.5.5 0 0 0-.707.707l.354.354 5.303 5.304a.5.5 0 0 0 .708 0l.354-.354 1.061 1.061h.001l.132.134-.609 1.828a.5.5 0 0 0 .12.511l-.354.354a1.503 1.503 0 0 0-.292 1.707l-.768.768-.354-.354a.514.514 0 0 0-.707 0L.443 23.778l-.353.354a.5.5 0 0 0 .707.707l2.475-2.475 5.657 5.656-2.475 2.476a.5.5 0 0 0 .708.707l.353-.353 5.303-5.304a.5.5 0 0 0 0-.707l-.354-.354.73-.73.465-.465 1.828.609a.506.506 0 0 0 .512-.121l.354.354a1.539 1.539 0 0 0 1.708.294l.767.767-.353.353a.5.5 0 0 0 0 .707l5.303 5.304.353.353a.498.498 0 0 0 .708 0 .5.5 0 0 0 0-.707l-2.475-2.476 5.657-5.656 2.475 2.475a.5.5 0 0 0 .707-.707l-.354-.354-5.303-5.304a.514.514 0 0 0-.707 0l-.354.354-1.061-1.061h-.001l-.133-.134.609-1.828a.5.5 0 0 0-.12-.511l.354-.354c.46-.461.558-1.149.292-1.707l.768-.768.354.354a.5.5 0 0 0 .708 0l5.303-5.304.354-.354a.5.5 0 1 0-.709-.707zM4.686 9.636l5.657-5.657L12.464 6.1l-.353.353-2.475 2.476-2.828 2.829-2.122-2.122zm3.536 2.122 2.121-2.122 2.121-2.122 1.061 1.06a.515.515 0 0 0 .708 0 .512.512 0 0 1 .707 0l.354.354-1.061 1.061-4.866 4.866.39-1.171a.5.5 0 0 0-.121-.512l-.684-.684-.73-.73zm1.414 15.556-5.657-5.657 2.122-2.122 2.828 2.829 2.475 2.475.353.353-2.121 2.122zm5.875-4.461-1.828-.609a.5.5 0 0 0-.512.121l-.354.354-.33.33-.73.73-2.121-2.122-2.121-2.122 1.061-1.061c.195-.195.195-.512 0-.707s-.195-.512 0-.707l6.365-6.364a.512.512 0 0 1 .707 0 .502.502 0 0 1 0 .708l-1.414 1.414a.5.5 0 0 0 .707.707l1.414-1.414a.514.514 0 0 1 .708 0 .499.499 0 0 1 0 .707l-1.414 1.414a.5.5 0 0 0 .708.707l1.414-1.414a.5.5 0 0 1 .707.707l-1.415 1.414a.5.5 0 0 0 .708.707l1.415-1.414a.512.512 0 0 1 .707 0 .5.5 0 0 1 0 .707l-2.964 2.964-.004.004-1.931 1.931a.5.5 0 0 0 .707.707l.3-.3.003-.002 1.631-1.631a1.23 1.23 0 0 1 1.559-.146l-3.683 3.68zm11.803-.489-5.657 5.657-2.121-2.121.353-.353 2.475-2.475 2.828-2.829 2.122 2.121zm-3.536-2.122-2.121 2.122-2.121 2.122-1.061-1.06a.516.516 0 0 0-.708 0 .512.512 0 0 1-.707 0l-.354-.354 3.559-3.56a.485.485 0 0 0 .119-.211.48.48 0 0 0 .211-.119l2.038-2.037-.391 1.172a.5.5 0 0 0 .121.512l.684.684.731.729zm.707-7.777-1.061 1.061c-.195.195-.195.512 0 .707s.195.512 0 .707l-3.529 3.528a2.22 2.22 0 0 0-.954-.459l1.655-1.655a1.501 1.501 0 0 0 0-2.121 1.48 1.48 0 0 0-.987-.411 1.488 1.488 0 0 0-.427-1.003 1.483 1.483 0 0 0-.982-.424 1.486 1.486 0 0 0-.432-.99 1.48 1.48 0 0 0-.987-.411 1.485 1.485 0 0 0-.428-1.004 1.413 1.413 0 0 0-.429-.278l.564-.564 1.828.609a.5.5 0 0 0 .512-.121l.354-.354.33-.33.73-.73 2.121 2.122 2.122 2.121zm1.414 0-2.828-2.829-2.475-2.475-.353-.353 2.121-2.121 5.657 5.657-2.122 2.121z"></path>
    <circle
      cx="25.9"
      cy="10.343"
      r=".5"
      transform="rotate(-45.001 25.9 10.343)"
    ></circle>
    <circle
      cx="6.1"
      cy="21.657"
      r=".5"
      transform="rotate(-45.001 6.1 21.657)"
    ></circle>
    <circle
      cx="21.657"
      cy="25.899"
      r=".5"
      transform="rotate(-45.001 21.657 25.9)"
    ></circle>
    <circle
      cx="10.343"
      cy="6.1"
      r=".5"
      transform="rotate(-45.001 10.344 6.1)"
    ></circle>
  </svg>
);

const CircularLogo = (props: SVGAttributes<SVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" version="1.1">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path
        fill="#7c3aed"
        fill-rule="evenodd"
        d="M48 23.977C48 37.248 37.248 48 23.978 48 10.752 48 0 37.248 0 23.977 0 10.752 10.752 0 23.978 0 37.248 0 48 10.752 48 23.977z"
        clip-rule="evenodd"
      ></path>
      <path
        fill="#f4f4f4"
        d="M33.899 21.672a.504.504 0 0 1-.354-.146l-6.364-6.364a.5.5 0 0 1 0-.707l5.303-5.304a.5.5 0 0 1 .707.707l-4.95 4.95 5.657 5.657 4.95-4.95a.5.5 0 0 1 .707.707l-5.303 5.304a.5.5 0 0 1-.353.146z"
      ></path>
      <path
        fill="#f4f4f4"
        d="M36.728 18.843a.502.502 0 0 1-.354-.146l-6.364-6.363a.5.5 0 0 1 0-.707l2.829-2.829a.5.5 0 0 1 .707.707l-2.475 2.476 5.657 5.656 2.475-2.475a.5.5 0 0 1 .707.707l-2.828 2.828a.502.502 0 0 1-.354.146zM26.829 17.429a.5.5 0 0 1-.354-.853l1.061-1.061a.5.5 0 0 1 .707.707l-1.061 1.061a.5.5 0 0 1-.353.146z"
      ></path>
      <circle
        cx="33.899"
        cy="18.343"
        r=".5"
        fill="#f4f4f4"
        transform="rotate(-45.001 33.9 18.344)"
      ></circle>
      <path
        fill="#f4f4f4"
        d="M28.243 27.328a.5.5 0 0 1-.354-.853l3.536-3.535c.194-.195.194-.512 0-.707s-.195-.512 0-.707l1.061-1.061-4.243-4.243-1.061 1.061a.5.5 0 0 1-.707-.707l1.414-1.414a.514.514 0 0 1 .707 0l4.95 4.95a.5.5 0 0 1 0 .707l-1.121 1.121a1.506 1.506 0 0 1-.292 1.707l-3.536 3.535a.502.502 0 0 1-.354.146z"
      ></path>
      <path
        fill="#f4f4f4"
        d="M22.586 18.843a.5.5 0 0 1-.354-.853L24 16.222a.502.502 0 0 1 .512-.121l1.828.609.465-.465a.5.5 0 0 1 .707.707l-.684.684a.5.5 0 0 1-.512.121l-1.828-.609-1.549 1.549a.498.498 0 0 1-.353.146zM15.161 38.996a.5.5 0 0 1-.354-.853l4.95-4.95-5.657-5.657-4.95 4.95a.5.5 0 0 1-.707-.707l5.303-5.304a.514.514 0 0 1 .707 0l6.364 6.364a.5.5 0 0 1 0 .707l-5.303 5.304a.498.498 0 0 1-.353.146z"
      ></path>
      <path
        fill="#f4f4f4"
        d="M14.808 39.35a.5.5 0 0 1-.354-.853l2.475-2.476-5.657-5.656-2.475 2.475a.5.5 0 0 1-.707-.707l2.828-2.828a.5.5 0 0 1 .707 0l6.364 6.363a.5.5 0 0 1 0 .707l-2.829 2.829a.496.496 0 0 1-.352.146zM20.111 32.632a.5.5 0 0 1-.354-.853l1.061-1.061a.5.5 0 0 1 .707.707l-1.061 1.061a.498.498 0 0 1-.353.146z"
      ></path>
      <circle
        cx="14.101"
        cy="29.657"
        r=".5"
        fill="#f4f4f4"
        transform="rotate(-45.001 14.1 29.657)"
      ></circle>
      <path
        fill="#f4f4f4"
        d="M23.646 29.097a.5.5 0 0 1-.354-.853l4.596-4.597a.5.5 0 0 0 0-.707.512.512 0 0 0-.707 0l-1.415 1.414a.5.5 0 0 1-.707-.707l1.415-1.414c.565-.566 1.554-.566 2.121 0a1.501 1.501 0 0 1 0 2.121L24 28.95a.5.5 0 0 1-.354.147z"
      ></path>
      <path
        fill="#f4f4f4"
        d="M25.414 24.5a.5.5 0 0 1-.354-.853l1.415-1.414a.5.5 0 0 0-.707-.707l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414a1.5 1.5 0 0 1 2.122 2.121l-1.415 1.414a.502.502 0 0 1-.354.146z"
      ></path>
      <path
        fill="#f4f4f4"
        d="M24 23.086a.5.5 0 0 1-.354-.853l1.414-1.414a.497.497 0 0 0 0-.707.514.514 0 0 0-.708 0l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414c.566-.566 1.555-.566 2.122 0 .283.282.438.658.439 1.06 0 .4-.156.778-.439 1.062l-1.414 1.414a.501.501 0 0 1-.353.145z"
      ></path>
      <path
        fill="#f4f4f4"
        d="M19.757 32.985a.504.504 0 0 1-.354-.146l-4.95-4.95a.5.5 0 0 1 0-.707l1.121-1.121a1.506 1.506 0 0 1 .292-1.707l6.365-6.364c.565-.566 1.554-.566 2.121 0a1.502 1.502 0 0 1 0 2.122l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414a.502.502 0 0 0 0-.708.512.512 0 0 0-.707 0l-6.365 6.364c-.194.195-.194.512 0 .707s.195.512 0 .707l-1.061 1.061 4.243 4.243 1.061-1.061a.5.5 0 0 1 .707.707l-1.414 1.414a.491.491 0 0 1-.352.146z"
      ></path>
      <path
        fill="#f4f4f4"
        d="M23.646 31.925a.537.537 0 0 1-.158-.025l-1.828-.61-.465.465a.5.5 0 0 1-.707-.707l.684-.684a.5.5 0 0 1 .512-.121l1.828.609 3.679-3.679a1.232 1.232 0 0 0-1.562.147l-1.931 1.931a.5.5 0 0 1-.707-.707l1.931-1.931a2.235 2.235 0 0 1 3.155 0l.19.19a.5.5 0 0 1 0 .707L24 31.778a.497.497 0 0 1-.354.147zM32.132 39.703a.502.502 0 0 1-.354-.146l-5.303-5.304a.5.5 0 0 1 0-.707l6.364-6.364a.514.514 0 0 1 .707 0l5.303 5.304a.5.5 0 0 1-.707.707l-4.95-4.95-5.657 5.657 4.95 4.95a.5.5 0 0 1-.353.853z"
      ></path>
      <path
        fill="#f4f4f4"
        d="M32.485 40.057a.502.502 0 0 1-.354-.146l-2.829-2.829a.5.5 0 0 1 0-.707l6.364-6.363a.5.5 0 0 1 .707 0l2.828 2.828a.5.5 0 0 1-.707.707l-2.475-2.475-5.657 5.656 2.475 2.476a.5.5 0 0 1-.352.853zM32.132 28.389a.502.502 0 0 1-.354-.146l-1.061-1.061a.5.5 0 0 1 .707-.707l1.061 1.061a.5.5 0 0 1-.353.853z"
      ></path>
      <circle
        cx="29.657"
        cy="33.899"
        r=".5"
        fill="#f4f4f4"
        transform="rotate(-45.001 29.657 33.9)"
      ></circle>
      <path
        fill="#f4f4f4"
        d="M27.536 33.692a.502.502 0 0 1-.354-.146l-1.121-1.12a1.539 1.539 0 0 1-1.708-.294l-.707-.707a.5.5 0 0 1 .707-.707l.707.707c.19.189.52.189.707 0a.516.516 0 0 1 .708 0l1.061 1.061 4.243-4.243-1.061-1.061a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707l-4.95 4.95a.494.494 0 0 1-.353.146z"
      ></path>
      <path
        fill="#f4f4f4"
        d="M31.401 27.658a.502.502 0 0 1-.354-.146l-.684-.684a.5.5 0 0 1-.121-.512l.609-1.828-.135-.135a.5.5 0 0 1 .707-.707l.355.354a.5.5 0 0 1 .121.512l-.609 1.828.465.465a.5.5 0 0 1-.354.853zM14.808 20.965a.504.504 0 0 1-.354-.146l-5.303-5.304a.5.5 0 0 1 .707-.707l4.95 4.95 5.657-5.657-4.95-4.95a.5.5 0 0 1 .707-.707l5.303 5.304a.5.5 0 0 1 0 .707l-6.364 6.364a.503.503 0 0 1-.353.146z"
      ></path>
      <path
        fill="#f4f4f4"
        d="M11.979 18.136a.502.502 0 0 1-.354-.146l-2.828-2.828a.5.5 0 0 1 .707-.707l2.475 2.475 5.657-5.656-2.475-2.476a.5.5 0 0 1 .707-.707l2.829 2.829a.5.5 0 0 1 0 .707l-6.364 6.363a.502.502 0 0 1-.354.146zM16.929 21.672a.502.502 0 0 1-.354-.146l-1.061-1.061a.5.5 0 0 1 .707-.707l1.061 1.061a.5.5 0 0 1-.353.853z"
      ></path>
      <circle
        cx="18.343"
        cy="14.101"
        r=".5"
        fill="#f4f4f4"
        transform="rotate(-45.001 18.343 14.1)"
      ></circle>
      <path
        fill="#f4f4f4"
        d="M16.929 21.672a.502.502 0 0 1-.354-.146l-1.414-1.414a.5.5 0 0 1 0-.707l4.95-4.95a.5.5 0 0 1 .707 0l1.121 1.12a1.537 1.537 0 0 1 1.708.294l.707.707a.5.5 0 0 1-.707.707l-.707-.707a.512.512 0 0 0-.707 0 .515.515 0 0 1-.708 0l-1.061-1.061-4.243 4.243 1.061 1.061a.5.5 0 0 1-.353.853z"
      ></path>
      <path
        fill="#f4f4f4"
        d="M16.929 24.5a.502.502 0 0 1-.354-.146L16.222 24a.5.5 0 0 1-.121-.512l.609-1.828-.465-.465a.5.5 0 0 1 .707-.707l.684.684a.5.5 0 0 1 .121.512l-.609 1.828.135.135a.5.5 0 0 1-.354.853z"
      ></path>
    </svg>
  </svg>
);

export default function ApplicationLogo({
  variant = "default",
  ...props
}: ApplicationLogoProps) {
  switch (variant) {
    case "circular":
      return <CircularLogo {...props} />;
    default:
      return <DefaultLogo {...props} />;
  }
}
