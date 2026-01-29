// Redux Store Configuration
import { configureStore } from "@reduxjs/toolkit";
import departmentReducer from "./slices/departmentSlice";
import studentReducer from "./slices/studentSlice";
import courseReducer from "./slices/courseSlice";
import enrollmentReducer from "./slices/enrollmentSlice";
import globalReducer from "./slices/globalSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
    reducer: {
        global: globalReducer,
        departments: departmentReducer,
        students: studentReducer,
        courses: courseReducer,
        enrollments: enrollmentReducer,
        auth: authReducer,
        users: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;







