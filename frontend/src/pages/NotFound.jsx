import { IconProtocol } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import DefaultLayout from "@/layout/DefaultLayout"
import { useNavigate } from "react-router-dom"

export function NotFound() {
    const navigate = useNavigate();

    return (
        <DefaultLayout>
            <div className="mx-auto mt-20 p-8">
                <Empty className="mt-20">
                    <EmptyHeader>
                        <EmptyMedia variant="icon" className="scale-150">
                            <IconProtocol color="var(--spurple)" />
                        </EmptyMedia>
                        <EmptyTitle className="text-xl mt-2">404 Error </EmptyTitle>
                        <EmptyTitle className="text-md">Page Not Found</EmptyTitle>
                        <EmptyDescription>
                            Oops... The page you are looking for does not exist.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <div className="flex gap-2">
                            <Button
                                className="bg-spurple text-white hover:bg-spurple/85"
                                onClick={() => navigate('/')}
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </EmptyContent>
                    <Button
                        variant="link"
                        asChild
                        className="text-muted-foreground"
                        size="sm"
                    >
                        <a href="#">
                            {// Treba da vodi na help kada ga implementiramo
                            }
                            Learn More <ArrowUpRightIcon />
                        </a>
                    </Button>
                </Empty>
            </div>
        </DefaultLayout>
    )
}
