import React from "react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Overview from "./Tabs/Overview";
import Security from "./Tabs/Security";
import Performance from "./Tabs/Performance";
import Network from "./Tabs/Network";
import RawData from "./Tabs/RawData";

const ResultsTabs = ({ results }) => (
  <Tabs>
    <TabList>
      <Tab>📈 Overview</Tab>
      <Tab>🔒 Security</Tab>
      <Tab>⚡ Performance</Tab>
      <Tab>🌐 Network</Tab>
      <Tab>📄 Raw Data</Tab>
    </TabList>

    <TabPanel><Overview results={results} /></TabPanel>
    <TabPanel><Security results={results} /></TabPanel>
    <TabPanel><Performance results={results} /></TabPanel>
    <TabPanel><Network results={results} /></TabPanel>
    <TabPanel><RawData results={results} /></TabPanel>
  </Tabs>
);

export default ResultsTabs;
