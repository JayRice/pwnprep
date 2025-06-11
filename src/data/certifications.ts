import {Certification} from "./interfaces.ts"
const certifications: Certification[] = [
    {
        id: "eJPT",
        title: "eLearnSecurity Junior Penetration Tester",
        description:
            "The eJPT is an entry-level certification covering fundamental skills in networking, web application testing, and penetration testing techniques.",
        icon: "ShieldCheck", // Lucide icon
        path: "/tests/ejpt/overview",
    },
    {
        id: "CPTS",
        title: "Certified Penetration Testing Specialist",
        description:
            "The CPTS focuses on hands-on penetration testing in realistic environments, emphasizing enumeration, exploitation, and privilege escalation.",
        icon: "Terminal", // Lucide icon
        path: "/tests/cpts/overview",
    },
    {
        id: "OSCP",
        title: "Offensive Security Certified Professional",
        description:
            "The OSCP is a highly respected certification testing advanced skills in network penetration testing, with a rigorous hands-on exam.",
        icon: "Bug", // Lucide icon
        path: "/tests/oscp/overview",
    },
];

export default certifications;
