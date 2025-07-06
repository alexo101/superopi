import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

interface TopUser {
  username: string;
  contributions: number;
  rank: number;
}

export default function Tops() {
  const { data: topUsers, isLoading } = useQuery<TopUser[]>({
    queryKey: ["/api/tops"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">🏆 Top Contribuidores</h1>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-16"></div>
          ))}
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-400" />;
      default:
        return null;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default"; // gold-like
      case 2:
        return "secondary"; // silver-like
      case 3:
        return "outline"; // bronze-like
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🏆 Top Contribuidores</h1>
      
      {topUsers && topUsers.length > 0 ? (
        <div className="space-y-3">
          {topUsers.map((user) => (
            <Card key={user.username} className={`${user.rank <= 3 ? 'border-2' : ''} ${
              user.rank === 1 ? 'border-yellow-300 bg-yellow-50' :
              user.rank === 2 ? 'border-gray-300 bg-gray-50' :
              user.rank === 3 ? 'border-orange-300 bg-orange-50' : ''
            }`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(user.rank)}
                    <Badge variant={getRankBadgeVariant(user.rank)}>
                      #{user.rank}
                    </Badge>
                  </div>
                  <span className="font-semibold text-lg">{user.username}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{user.contributions}</div>
                  <div className="text-sm text-gray-500">
                    contribucion{user.contributions !== 1 ? 'es' : ''}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aún no hay contribuciones registradas</p>
            <p className="text-sm text-gray-500 mt-2">¡Sé el primero en subir un producto!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}