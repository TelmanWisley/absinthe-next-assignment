"use client"
import TypeScriptSDK from "@telmanwisley/typescript-sdk";
import { ChangeEvent, useState } from "react";
import { Input } from "./common";

const DistributePoint: React.FC = () => {
  const [state, setState] = useState({
    apiKey: "",
    campaignId: "",
    eventName: "",
    points: "",
    address: "",
    message: "",
    isLoading: false,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    setState({ ...state, isLoading: true });
    e.preventDefault();
    const pointClient = new TypeScriptSDK(state.apiKey, state.campaignId);
    try {
      await pointClient.distribute(state.eventName, {
        points: parseInt(state.points),
        address: state.address,
      });
      setState({
        ...state,
        eventName: "",
        points: "",
        address: "",
        message: "Points distributed",
      });
    } catch (error) {
      setState({ ...state, message: `Error: ${error}` });
    }
    setState({ ...state, isLoading: false });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  return (
    <div className="">
      <h1>Distribute Points</h1>
      <form onSubmit={handleSubmit}>
        <Input
          value={state.apiKey}
          onChange={handleChange}
          label="API key"
          name="apiKey"
        />
        <Input
          value={state.campaignId}
          onChange={handleChange}
          label="Campaign Id"
          name="campaignId"
        />
        <Input
          value={state.eventName}
          onChange={handleChange}
          label="Event Name"
          name="eventName"
        />
        <Input
          value={state.address}
          onChange={handleChange}
          label="Address"
          name="address"
        />
        <Input
          value={state.points}
          onChange={handleChange}
          label="Points"
          name="points"
        />
      </form>
      {state.message && (
        <p
          className={`mt-4 text-center font-bold`}
          style={{
            color: state.message.substring(0, 4) === "Error" ? "red" : "green",
          }}
        >
          {state.message}
        </p>
      )}
    </div>
  );
};

export default DistributePoint;
