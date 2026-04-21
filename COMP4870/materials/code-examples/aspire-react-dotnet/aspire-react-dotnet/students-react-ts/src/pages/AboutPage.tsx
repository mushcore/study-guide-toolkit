type AboutPageProps = {
    message: string;
};

const AboutPage = ({ message }: AboutPageProps) => {
    return (
        <section>
            <h3>{message}</h3>
        </section>
    );
};

export default AboutPage;
