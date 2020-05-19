import React from "react";
import PropTypes from "prop-types";
import { iconStyle, disabledIconStyle, svgStyle, iconSmall } from "./styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

const darkSvg = (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="46px"
    height="46px"
    viewBox="0 0 46 46"
    style={svgStyle}
  >
    <defs>
      <filter
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        filterUnits="objectBoundingBox"
        id="filter-1"
      >
        <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="0.5"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0"
          in="shadowBlurOuter1"
          type="matrix"
          result="shadowMatrixOuter1"
        />
        <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2" />
        <feGaussianBlur
          stdDeviation="0.5"
          in="shadowOffsetOuter2"
          result="shadowBlurOuter2"
        />
        <feColorMatrix
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0"
          in="shadowBlurOuter2"
          type="matrix"
          result="shadowMatrixOuter2"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="shadowMatrixOuter2" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <rect id="path-2" x="0" y="0" width="40" height="40" rx="2" />
      <rect id="path-3" x="5" y="5" width="38" height="38" rx="1" />
    </defs>
    <g
      id="Google-Button"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="9-PATCH" transform="translate(-608.000000, -219.000000)" />
      <g
        id="btn_google_dark_normal"
        transform="translate(-1.000000, -1.000000)"
      >
        <g
          id="button"
          transform="translate(4.000000, 4.000000)"
          filter="url(#filter-1)"
        >
          <g id="button-bg">
            <use fill="#4285F4" fillRule="evenodd" />
            <use fill="none" />
            <use fill="none" />
            <use fill="none" />
          </g>
        </g>
        <g id="button-bg-copy">
          <use fill="#FFFFFF" fillRule="evenodd" />
          <use fill="none" />
          <use fill="none" />
          <use fill="none" />
        </g>
        <g id="logo_googleg_48dp" transform="translate(15.000000, 15.000000)">
          <path
            d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
            id="Shape"
            fill="#4285F4"
          />
          <path
            d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
            id="Shape"
            fill="#34A853"
          />
          <path
            d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
            id="Shape"
            fill="#FBBC05"
          />
          <path
            d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
            id="Shape"
            fill="#EA4335"
          />
          <path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" />
        </g>
        <g id="handles_square" />
      </g>
    </g>
  </svg>
);

const lightSvg = (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="46px"
    height="46px"
    viewBox="0 0 46 46"
    style={svgStyle}
  >
    <defs>
      <filter
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        filterUnits="objectBoundingBox"
        id="filter-1"
      >
        <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="0.5"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0"
          in="shadowBlurOuter1"
          type="matrix"
          result="shadowMatrixOuter1"
        />
        <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2" />
        <feGaussianBlur
          stdDeviation="0.5"
          in="shadowOffsetOuter2"
          result="shadowBlurOuter2"
        />
        <feColorMatrix
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0"
          in="shadowBlurOuter2"
          type="matrix"
          result="shadowMatrixOuter2"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="shadowMatrixOuter2" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <rect id="path-2" x="0" y="0" width="40" height="40" rx="2" />
    </defs>
    <g
      id="Google-Button"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="9-PATCH" transform="translate(-608.000000, -160.000000)" />
      <g
        id="btn_google_light_normal"
        transform="translate(-1.000000, -1.000000)"
      >
        <g
          id="button"
          transform="translate(4.000000, 4.000000)"
          filter="url(#filter-1)"
        >
          <g id="button-bg">
            <use fill="#FFFFFF" fillRule="evenodd" />
            <use fill="none" />
            <use fill="none" />
            <use fill="none" />
          </g>
        </g>
        <g id="logo_googleg_48dp" transform="translate(15.000000, 15.000000)">
          <path
            d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
            id="Shape"
            fill="#4285F4"
          />
          <path
            d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
            id="Shape"
            fill="#34A853"
          />
          <path
            d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
            id="Shape"
            fill="#FBBC05"
          />
          <path
            d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
            id="Shape"
            fill="#EA4335"
          />
          <path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" />
        </g>
        <g id="handles_square" />
      </g>
    </g>
  </svg>
);

const disabledSvg = (
  <svg
    width="46px"
    height="46px"
    viewBox="0 0 46 46"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    style={svgStyle}
  >
    <defs>
      <rect id="path-1" x="0" y="0" width="40" height="40" rx="2" />
    </defs>
    <g
      id="Google-Button"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="9-PATCH" transform="translate(-788.000000, -219.000000)" />
      <g
        id="btn_google_dark_disabled"
        transform="translate(-1.000000, -1.000000)"
      >
        <g id="button" transform="translate(4.000000, 4.000000)">
          <g id="button-bg">
            <use fillOpacity="0.08" fill="#000000" fillRule="evenodd" />
            <use fill="none" />
            <use fill="none" />
            <use fill="none" />
          </g>
        </g>
        <path
          d="M24.001,25.71 L24.001,22.362 L32.425,22.362 C32.551,22.929 32.65,23.46 32.65,24.207 C32.65,29.346 29.203,33 24.01,33 C19.042,33 15.01,28.968 15.01,24 C15.01,19.032 19.042,15 24.01,15 C26.44,15 28.474,15.891 30.031,17.349 L27.475,19.833 C26.827,19.221 25.693,18.501 24.01,18.501 C21.031,18.501 18.601,20.976 18.601,24.009 C18.601,27.042 21.031,29.517 24.01,29.517 C27.457,29.517 28.726,27.132 28.96,25.719 L24.001,25.719 L24.001,25.71 Z"
          id="Shape-Copy"
          fillOpacity="0.4"
          fill="#000000"
        />
        <g id="handles_square" />
      </g>
    </g>
  </svg>
);
export const guestSvg = (
  <svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512">
    <g>
      <g>
        <path
          d="M504.116,136.466c-4.855-2.618-10.756-2.357-15.364,0.675l-0.447,0.295c-22.445,14.729-49.796,20.501-77.012,16.248
			c-9.894-1.546-20.117-2.329-30.388-2.329c-6.735,0-13.625,0.695-20.48,2.067c-16.605,3.323-32.763,10.87-46.723,21.822
			L256,220.514l-57.702-45.27c-13.96-10.952-30.117-18.499-46.724-21.822c-6.854-1.372-13.744-2.067-20.479-2.067
			c-10.271,0-20.494,0.783-30.388,2.329c-27.214,4.249-54.565-1.518-76.993-16.236l-0.466-0.307
			c-4.607-3.032-10.509-3.292-15.364-0.675C3.027,139.083,0,144.153,0,149.67v129.681c0,39.077,37.071,72.892,92.247,84.145
			c22.046,4.497,45.08,2.526,66.618-5.696c3.191-1.219,6.492-2.239,9.811-3.034c17.32-4.147,35.79-0.299,50.682,10.564
			c0.02,0.014,0.044,0.031,0.069,0.05c10.941,7.967,23.757,11.949,36.573,11.949c12.832,0,25.664-3.993,36.614-11.979
			c15.313-11.169,34.385-14.879,52.332-10.177c2.761,0.723,5.516,1.606,8.188,2.627c21.536,8.223,44.572,10.195,66.617,5.696
			C474.929,352.243,512,318.428,512,279.351V149.67C512,144.153,508.973,139.083,504.116,136.466z M482.002,279.351H482
			c0,24.042-28.063,46.556-68.242,54.75c-16.458,3.354-33.719,1.856-49.925-4.329c-3.683-1.406-7.48-2.624-11.285-3.62
			c-26.696-6.996-54.985-1.543-77.611,14.959c-11.326,8.262-26.547,8.262-37.873,0c-0.02-0.014-0.045-0.032-0.07-0.051
			c-22.001-16.028-49.449-21.666-75.307-15.469c-4.573,1.095-9.122,2.502-13.521,4.181c-16.206,6.188-33.471,7.684-49.925,4.329
			C58.062,325.906,30,303.393,30,279.351v-104.8c23.466,9.7,49.475,12.813,75.338,8.773c8.366-1.307,17.032-1.97,25.757-1.97
			c4.763,0,9.673,0.499,14.592,1.483c12.022,2.406,23.812,7.942,34.094,16.01l66.961,52.533c5.436,4.264,13.082,4.264,18.518,0
			l66.961-52.533c10.282-8.067,22.071-13.604,34.093-16.01c4.92-0.984,9.83-1.483,14.593-1.483c8.725,0,17.391,0.663,25.757,1.97
			c25.86,4.04,51.865,0.927,75.338-8.775V279.351z"
        />
      </g>
    </g>
    <g>
      <g>
        <path
          d="M207.444,252.627c-1.266-1.12-31.444-27.431-69.683-27.431c-38.239,0-68.417,26.311-69.683,27.431
			c-3.218,2.848-5.061,6.938-5.061,11.234c0,4.296,1.843,8.387,5.061,11.234c1.266,1.12,31.444,27.431,69.683,27.431
			c38.239,0,68.417-26.311,69.683-27.431c3.218-2.848,5.061-6.938,5.061-11.234S210.662,255.475,207.444,252.627z M137.762,272.526
			c-12.241,0-23.692-4.153-32.521-8.664c8.831-4.515,20.28-8.666,32.521-8.666c12.241,0,23.688,4.151,32.52,8.665
			C161.45,268.375,150.002,272.526,137.762,272.526z"
        />
      </g>
    </g>
    <g>
      <g>
        <path
          d="M443.922,252.627c-1.266-1.12-31.444-27.431-69.683-27.431c-38.239,0-68.418,26.311-69.683,27.431
			c-3.218,2.848-5.061,6.938-5.061,11.234c0,4.296,1.843,8.387,5.061,11.234c1.266,1.12,31.444,27.431,69.683,27.431
			s68.417-26.311,69.683-27.431c3.218-2.848,5.061-6.938,5.061-11.234S447.14,255.474,443.922,252.627z M374.238,272.526
			c-12.241,0-23.692-4.153-32.521-8.664c8.831-4.515,20.28-8.666,32.521-8.666c12.241,0,23.688,4.151,32.52,8.665
			C397.927,268.375,386.479,272.526,374.238,272.526z"
        />
      </g>
    </g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
  </svg>
);

export const GoogleIcon = ({ disabled, type }) => (
  <div style={!disabled ? iconStyle : { ...iconStyle, ...disabledIconStyle }}>
    {!disabled ? (type === "dark" ? darkSvg : lightSvg) : disabledSvg}
  </div>
);

GoogleIcon.propTypes = {
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(["light", "dark"])
};

GoogleIcon.defaultProps = {
  type: "dark"
};

export const GuestIcon = ({ disabled, type }) => (
  <div
    style={
      !disabled
        ? { ...iconStyle, ...iconSmall }
        : { ...iconStyle, ...disabledIconStyle }
    }
  >
    <AccountCircleIcon style={{ width: 24, height: 24 }} />
  </div>
);

export const MailIcon = ({ disabled, type }) => (
  <div
    style={
      !disabled
        ? { ...iconStyle, ...iconSmall }
        : { ...iconStyle, ...disabledIconStyle }
    }
  >
    <MailOutlineIcon /* color="primary"  */ style={{ width: 24, height: 24 }} />
  </div>
);
