import Comics from "@/components/Comics";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Characters from "@/components/Characters";
import Entertainment from "@/components/Entertainment";
import Chatbot from "@/components/Chatbot";
import {CharacterData} from "@/components/CharacterData";
import { ComicsData } from "@/components/ComicsData";
import { EntertainmentData } from "@/components/EntertainmentData";

export default function Home() {
  return (
    <>
      <Hero />
      <ComicsData />
      <CharacterData />
      <EntertainmentData />
      <Chatbot />
    </>
  );
}
