"use client";
import React from "react";
import { useSubscription } from "@apollo/client";
import { INVITATION_RECEIVED_SUBSCRIPTION } from "../utils/notification";
import { useProject } from "../components/Context/ProjectContext";
interface IProp {
  projectId: string;
}

interface Invitation {
  userId: string;
  status: string;
}

function Notification() {
  const { projectID, setProjectId } = useProject();
  const { data, loading, error } = useSubscription(
    INVITATION_RECEIVED_SUBSCRIPTION,
    {
      variables: { projectId: projectID },
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { invitationReceived } = data || {
    invitationReceived: { invitations: [] },
  };
  console.log(invitationReceived);
  
  return (
    <div>
      {invitationReceived?.invitations.length > 0 ? (
        <ul>
          {invitationReceived.invitations.map((invitation: Invitation) => (
            <li key={invitation.userId}>
              User {invitation.userId} has an invitation with status{" "}
              {invitation.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No new invitations.</p>
      )}
    </div>
  );
}

export default Notification;
