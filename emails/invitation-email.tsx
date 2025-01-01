import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { siteConfig } from "@/config/site";

interface InvitationEmailProps {
  inviteeEmail: string;
  inviterName: string;
  actionUrl: string;
  siteName: string;
}

export const InvitationEmail = ({
  inviteeEmail,
  inviterName,
  actionUrl,
  siteName,
}: InvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Join {siteName} - You've been invited!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You've been invited to join {siteName}!</Heading>
          <Text style={text}>Hi {inviteeEmail},</Text>
          <Text style={text}>
            {inviterName} has invited you to join {siteName}. Click the button below to accept the invitation and create your account.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={actionUrl}>
              Accept Invitation
            </Button>
          </Section>
          <Text style={text}>
            If you don't want to accept this invitation, you can ignore this email.
            The invitation link will expire in 24 hours.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            This invitation was sent to {inviteeEmail}. If you were not expecting
            this invitation, you can ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  margin: "24px 0",
  padding: "0 48px",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginTop: "12px",
  padding: "0 48px",
};

export default InvitationEmail; 