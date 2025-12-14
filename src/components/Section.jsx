import { motion } from 'framer-motion';

const Section = ({ children, delay = 0, style }) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, delay, ease: "easeOut" }} // Synced with scroll speed (1.2s)
            style={{
                ...style,
                width: '100%'
            }}
        >
            {children}
        </motion.section>
    );
};

export default Section;
