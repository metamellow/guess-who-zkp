// The 'guess_who_zkp' program.
program guess_who_zkp.aleo {
    transition main(public a: u32, b: u32) -> u32 {
        let c: u32 = a + b;
        return c;
    }
}
