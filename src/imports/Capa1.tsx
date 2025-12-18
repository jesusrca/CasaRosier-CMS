import svgPaths from "./svg-gh8llydty3";

function Group() {
  return (
    <div className="absolute contents inset-[60.44%_15.29%_10.99%_22.93%]" data-name="Group">
      <p className="absolute font-['Calibri:Regular',sans-serif] inset-[60.44%_15.29%_10.99%_22.93%] leading-[normal] not-italic text-[#1e130f] text-[287.535px] text-nowrap">CASA ROSIER</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[88.28%_27.44%_0_30.84%]" data-name="Group">
      <p className="absolute font-['Calibri:Regular',sans-serif] inset-[88.28%_27.44%_0_30.84%] leading-[normal] not-italic text-[#1e130f] text-[117.77px] text-nowrap">CERÁMICA ARTÍSTICA</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[60.44%_15.29%_0_22.93%]" data-name="Group">
      <Group />
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[0_0_38.63%_0]" data-name="Group">
      <div className="absolute inset-[-0.28%_-0.11%_-0.36%_-0.08%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2477 759">
          <g id="Group">
            <path d={svgPaths.p220e6600} fill="var(--fill-0, #1E130F)" id="Vector" stroke="var(--stroke-0, #1E130F)" strokeMiterlimit="10" strokeWidth="4.16667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <Group2 />
      <Group3 />
    </div>
  );
}

export default function Capa() {
  return (
    <div className="relative size-full" data-name="Capa-1">
      <Group4 />
    </div>
  );
}