(SETUPBLACK)
    // Set pointer to top left of screen
    @SCREEN
    D=A
    @R0
    M=D

    // Set memory space size for screen
    @8192 // (512x32)/16
    D=A
    @R1
    M=D

(FILLBLACK)
    @R0
    A=M  // Manually set address to pointer
    M=-1 // Fill in with 1111111111111111
    @R0
    MD=M+1

    // If screen is filled, start filling white
    @R1
    MD=M-1
    @SETUPWHITE
    D;JEQ

    // Else keep filling black
    @FILLBLACK
    D;JMP

(SETUPWHITE)
    // Set pointer to top left of screen
    @SCREEN
    D=A
    @R0
    M=D

    // Set memory space size for screen
    @8192 // (512x32)/16
    D=A
    @R1
    M=D

(FILLWHITE)
    @R0
    A=M  // Manually set address to pointer
    M=0 // Fill in with 1111111111111111
    @R0
    MD=M+1

    // If screen is filled, start filling black
    @R1
    MD=M-1
    @SETUPBLACK
    D;JEQ

    // Else keep filling white
    @FILLWHITE
    D;JMP
