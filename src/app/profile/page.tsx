import { Container } from "@/components/layout/Container";
import { ProfileDashboard } from "@/features/auth";

export default function ProfilePage() {
  return (
    <Container className="section-spacing">
      <ProfileDashboard />
    </Container>
  );
}

