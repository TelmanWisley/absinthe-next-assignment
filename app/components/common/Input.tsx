import { ChangeEvent } from "react";

interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <div className="flex flex-col">
      <label>{props.label}</label>
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        name={props.name}
      />
    </div>
  );
};
