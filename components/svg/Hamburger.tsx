const Hamburger = (props: { className?: string }): JSX.Element => {
  const { className } = props;
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <g
        id="Page-1"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g id="Menu">
          <rect
            id="Rectangle"
            fill-rule="nonzero"
            x="0"
            y="0"
            width="24"
            height="24"
          ></rect>
          <line
            x1="5"
            y1="7"
            x2="19"
            y2="7"
            id="Path"
            stroke="#0C0310"
            stroke-width="2"
            stroke-linecap="round"
          ></line>
          <line
            x1="5"
            y1="17"
            x2="19"
            y2="17"
            id="Path"
            stroke="#0C0310"
            stroke-width="2"
            stroke-linecap="round"
          ></line>
          <line
            x1="5"
            y1="12"
            x2="19"
            y2="12"
            id="Path"
            stroke="#0C0310"
            stroke-width="2"
            stroke-linecap="round"
          ></line>
        </g>
      </g>
    </svg>
  );
};

export default Hamburger;
