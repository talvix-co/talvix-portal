import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAuth } from '../contexts/AuthContext'
import { useParams, Link } from 'react-router-dom'

export function TenantJobs() {
  const { tenantId } = useParams()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Tenant Jobs
            </h1>
            <p className="text-muted-foreground mt-2">
              Viewing jobs for tenant: {tenantId}
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/">Back to Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">We are working on it</h2>
              <p className="text-muted-foreground">
                The tenant jobs functionality is currently under development.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}