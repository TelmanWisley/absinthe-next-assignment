"use client";
import React, { ChangeEvent, useState } from "react";
import TypeScriptSDK from "@telmanwisley/typescript-sdk";
import { Input } from "./common";
type StateType = {
  apiKey: string;
  campaignId: string;
  eventName: string;
  address: string;
  message: string;
  pointData: any;
  isLoading: boolean;
};

const CheckPoints: React.FC = () => {
  const [state, setState] = useState<StateType>({
    apiKey: "",
    campaignId: "",
    eventName: "",
    address: "",
    message: "",
    pointData: "",
    isLoading: false,
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    setState({ ...state, isLoading: true });
    e.preventDefault();
    const pointClient = new TypeScriptSDK(state.apiKey, state.campaignId);
    try {
      if (state.eventName.length > 0) {
        const pointData = await pointClient.getPointsByEvent(
          state.address,
          state.eventName
        );
        setState({ ...state, pointData: { ...pointData } });
      } else {
        const pointData = await pointClient.getPoints(state.address);
        setState({ ...state, pointData: { ...pointData } });
      }
      setState({ ...state, eventName: "", address: "", message: "Points: " });
    } catch (error) {
      setState({ ...state, message: `Error: ${error}` });
    }
    setState({ ...state, isLoading: false });
  };
  return (
    <div>
      <h1>Check Points</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="API Key"
          value={state.apiKey}
          onChange={handleChange}
          name="apiKey"
        />
        <Input
          label="Campaign Id"
          value={state.campaignId}
          onChange={handleChange}
          name="campaignId"
        />
        <Input
          label="Event Name"
          value={state.eventName}
          onChange={handleChange}
          name="eventName"
        />
        <button type="submit" disabled={state.isLoading}>
          Check Point
        </button>
      </form>
      {state.pointData && state.pointData?.rows?.length > 0 ? (
        <div className="">
          {state.pointData.rows[0].event_name ? (
            <p>Event: {state.pointData.rows[0].event_name}</p>
          ) : null}
          <p>Points: {state.pointData.rows[0].points}</p>
          <p>
            modified:{" "}
            {state.pointData.rows[0].last_modified
              ? state.pointData.rows[0].last_modified
              : state.pointData.rows[0].timestamp}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default CheckPoints;
