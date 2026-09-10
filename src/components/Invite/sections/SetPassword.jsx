"use client"
import { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { MdLock, } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { muiDark } from "@/styles/StyleInputs";
import ShowPassword from "@/components/ui/Buttons/ShowPassword";

export default function SetPassword({confirmPassword, setConfirmPassword, setPassword, password }) {
    const [seePassword, setSeePassword] = useState(false);
    const [seeConfirm, setSeeConfirm] = useState(false);

    return (
        <div className="flex flex-col gap-3.5">
                    <TextField
                        label="Senha"
                        type={seePassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        sx={muiDark}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start"><MdLock className="text-brand-500" size={18} /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <ShowPassword
                                            setSeePassword={setSeePassword}
                                            seePassword={seePassword}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        label="Confirme a senha"
                        type={seeConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        sx={muiDark}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start"><MdLock className="text-brand-500" size={18} /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <ShowPassword
                                            setSeePassword={setSeeConfirm}
                                            seePassword={seeConfirm}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </div>
    )
}
