import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface AccessRequiredEmailProps {
  userEmail: string;
}

export default function AccessRequiredEmail({
  userEmail,
}: AccessRequiredEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your interest in our platform</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            Thank You for Your Interest
          </Heading>
          <Text style={text}>
            Hello,
          </Text>
          <Text style={text}>
            Thank you for trying to access our platform. We noticed you used the email: {userEmail}.
          </Text>
          <Text style={text}>
            Our platform is currently private and requires a brief consultation before granting access. This helps us ensure we can provide the best possible experience tailored to your needs.
          </Text>
          <Section style={buttonContainer}>
            <Button
              style={button}
              href="http://localhost:3000/book-consultation"
            >
              Book Your Consultation
            </Button>
          </Section>
          <Text style={text}>
            During our consultation, we will:
          </Text>
          <Text style={text}>
            • Understand your specific needs and goals<br />
            • Explain how our platform can help you succeed<br />
            • Answer any questions you might have<br />
            • Set up your account if we&apos;re a good fit
          </Text>
          <Text style={text}>
            We&apos;re excited about the possibility of working together and helping you achieve your goals.
          </Text>
          <Text style={footer}>
            If you have any immediate questions, feel free to reply to this email or schedule your consultation using the button above.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
  textAlign: "center" as const,
};

const text = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#484848",
  marginBottom: "10px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 20px",
};

const footer = {
  fontSize: "12px",
  lineHeight: "24px",
  color: "#898989",
  marginTop: "20px",
}; 