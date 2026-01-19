// Redux Store Configuration
import { configureStore } from "@reduxjs/toolkit";
import departmentReducer from "./slices/departmentSlice";
import studentReducer from "./slices/studentSlice";
import courseReducer from "./slices/courseSlice";

export const store = configureStore({
    reducer: {
        departments: departmentReducer,
        students: studentReducer,
        courses: courseReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;







